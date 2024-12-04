// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package code 发送一次性验证码类型的验证
package code

import (
	"errors"
	"strconv"
	"time"

	"github.com/issue9/cache"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport/utils"
)

type code struct {
	db    *orm.DB
	cache web.Cache

	sender  Sender
	expired time.Duration
	resend  time.Duration
	gen     Generator
	id      string
	desc    web.LocaleStringer
	user    *user.Module
}

// New 声明基于验证码的验证方法
//
// id 该适配器的唯一 ID，同时也作为表名的一部分，不应该包含特殊字符；
// expired 表示验证码的过期时间；
func Init(user *user.Module, expired, resend time.Duration, gen Generator, sender Sender, id string, desc web.LocaleStringer) user.Passport {
	initProblems(user.Module().Server())

	if gen == nil {
		gen = NumberGenerator(user.Module().Server(), id, 4)
	}

	idPrefix := user.Module().ID() + "_passports_" + id + "_"

	c := &code{
		db:    utils.BuildDB(user.Module(), id),
		cache: web.NewCache(idPrefix, user.Module().Server().Cache()),

		sender:  sender,
		expired: expired,
		resend:  resend,
		gen:     gen,
		id:      id,
		desc:    desc,
		user:    user,
	}

	prefix := user.URLPrefix() + "/passports/" + id
	rate := ratelimit.New(web.NewCache(idPrefix+"_rate_", user.Module().Server().Cache()), 20, time.Second, nil)

	user.Module().Router().Prefix(prefix).
		Post("/login", c.postLogin, rate, cmfx.Unlimit(user.Module().Server()), user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("login by %s api", id), nil).
				Body(accountTO{}, false, nil, nil).
				Response("201", token.Response{}, nil, nil)
		})).
		Post("/login/code", c.requestLoginCode, rate, cmfx.Unlimit(user.Module().Server()), c.user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("request code for %s passport login api", id), nil).
				Response("201", TargetTO{}, nil, nil)
		}))

	user.Module().Router().Prefix(prefix, user).
		Post("", c.bindCode, c.user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("bind %s passport for current user api", id), nil).
				Body(accountTO{}, false, nil, nil).
				ResponseEmpty("201")
		})).
		Delete("", c.deleteTOTP, c.user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("delete %s passport for current user api", id), nil).
				ResponseEmpty("204")
		})).
		Post("/code", c.requestBindCode, rate, cmfx.Unlimit(user.Module().Server()), c.user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("request code for %s passport bind api", id), nil).
				Response("201", TargetTO{}, nil, nil)
		}))

	user.AddPassport(c)

	return c
}

// 已登录状态下请求绑定时发送的验证码
func (e *code) requestBindCode(ctx *web.Context) web.Responser {
	return e.requestCode(ctx, true)
}

// 请求发送登录的验证码
func (e *code) requestLoginCode(ctx *web.Context) web.Responser {
	return e.requestCode(ctx, false)
}

func (e *code) requestCode(ctx *web.Context, isLogin bool) web.Responser {
	data := &TargetTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	code := &codePO{}
	err := e.cache.Get(data.Target, code)
	if err != nil && !errors.Is(err, cache.ErrCacheMiss()) {
		return ctx.Error(err, "")
	}
	if err == nil && code.ReSend.After(ctx.Begin()) { // 存在且未过再次发送的时间点
		h := ctx.Header()
		h.Set(header.XRateLimitLimit, "1")
		h.Set(header.XRateLimitRemaining, "0")
		h.Set(header.XRateLimitReset, strconv.FormatInt(code.ReSend.Unix(), 10))
		return ctx.Problem(web.ProblemTooManyRequests)
	}

	if isLogin { // 登录状态需要检测是否已绑定到其它账号
		mod := &accountPO{Target: data.Target}
		found, err := e.db.Select(mod)
		switch {
		case err != nil:
			return ctx.Error(err, "")
		case found && mod.UID > 0:
			return ctx.Problem(web.ProblemBadRequest).WithParam("target", web.Phrase("has been bind to other account").LocaleString(ctx.LocalePrinter()))
		}
	}

	v := e.gen()
	go func() {
		if err := e.sender.Sent(data.Target, v); err != nil {
			e.user.Module().Server().Logs().ERROR().Error(err)
		}
	}()

	if err := e.cache.Set(data.Target, &codePO{Code: v, ReSend: ctx.Now().Add(e.resend)}, e.expired); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

func (e *code) bindCode(ctx *web.Context) web.Responser {
	data := &accountTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	code := &codePO{}
	err := e.cache.Get(data.Target, code)
	switch {
	case errors.Is(err, cache.ErrCacheMiss()):
		return ctx.Problem(cmfx.BadRequestInvalidBody).WithParam("target", web.Phrase("not exists").LocaleString(ctx.LocalePrinter()))
	case err != nil:
		return ctx.Error(err, "")
	case code.Code != data.Code:
		return ctx.Problem(cmfx.BadRequestInvalidBody).WithParam("code", locales.InvalidValue.LocaleString(ctx.LocalePrinter()))
	}

	mod := &accountPO{Target: data.Target}
	found, err := e.db.Select(mod)
	switch {
	case err != nil:
		return ctx.Error(err, "")
	case found:
		return ctx.Problem(problemHasBind)
	}

	mod = &accountPO{
		ID:  mod.ID,
		UID: e.user.CurrentUser(ctx).ID,
	}
	if _, _, err := e.db.Save(mod); err != nil {
		return ctx.Error(err, "")
	}

	if err := e.cache.Delete(data.Target); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

func (e *code) postLogin(ctx *web.Context) web.Responser {
	data := &accountTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	code := &codePO{}
	err := e.cache.Get(data.Target, code)
	switch {
	case errors.Is(err, cache.ErrCacheMiss()):
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	case err != nil:
		return ctx.Error(err, "")
	case code.Code != data.Code:
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	}

	mod := &accountPO{Target: data.Target}
	found, err := e.db.Select(mod)
	if err != nil {
		return ctx.Error(err, "")
	}

	if !found { // 未关联账号
		uid, err := e.user.New(user.StateNormal, data.Target, "")
		if err != nil {
			return ctx.Error(err, "")
		}
		mod = &accountPO{
			Target: data.Target,
			UID:    uid,
		}
		if _, _, err := e.db.Save(mod); err != nil {
			return ctx.Error(err, "")
		}
	}

	if err := e.cache.Delete(data.Target); err != nil {
		return ctx.Error(err, "")
	}

	u, err := e.user.GetUser(mod.UID)
	if err != nil {
		return ctx.Error(err, "")
	}
	return e.user.CreateToken(ctx, u, e)
}

func (e *code) deleteTOTP(ctx *web.Context) web.Responser {
	if err := e.Delete(e.user.CurrentUser(ctx).ID); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

func (e *code) ID() string { return e.id }

func (e *code) Description() web.LocaleStringer { return e.desc }

func (e *code) Delete(uid int64) error {
	_, err := e.db.Where("uid=?", uid).Delete(&accountPO{}) // uid == 0 也是有效值
	return err
}

func (e *code) Identity(uid int64) string {
	mod := &accountPO{UID: uid}
	found, err := e.db.Select(mod)
	if err != nil {
		e.user.Module().Server().Logs().ERROR().Error(err)
		return ""
	}
	if !found {
		return ""
	}
	return mod.Target
}
