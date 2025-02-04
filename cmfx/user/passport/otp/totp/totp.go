// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

// Package totp 提供基于 [TOTP] 的 [passport.Passport] 实现
//
// [TOTP]: https://datatracker.ietf.org/doc/html/rfc6238
package totp

import (
	"crypto/hmac"
	"crypto/sha1"
	"database/sql"
	"encoding/binary"
	"math"
	"strconv"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport/utils"
)

// 密钥未绑定时的过期时间
const (
	secretExpiredInSeconds = 10 * 60
	secretExpired          = secretExpiredInSeconds * time.Second
)

type totp struct {
	user *user.Module
	db   *orm.DB
	id   string
	desc web.LocaleStringer
}

// Init 向 user 注册 [TOTP] 的验证方式
//
// [TOTP]: https://datatracker.ietf.org/doc/html/rfc6238
func Init(user *user.Module, id string, desc web.LocaleStringer) user.Passport {
	initProblems(user.Module().Server()) // 私有的错误码

	p := &totp{
		user: user,
		db:   utils.BuildDB(user.Module(), id),
		id:   id,
		desc: desc,
	}

	user.Module().Server().Services().AddTicker(web.Phrase("gc totp secret code"), func(now time.Time) error {
		_, err := p.db.SQLBuilder().Delete().
			Where("requested>?", now.Add(secretExpired)).
			AndIsNull("binded").
			Table(orm.TableName(&accountPO{})).
			Exec()
		return err
	}, time.Minute, false, false)

	prefix := utils.BuildPrefix(user, id)
	rate := utils.BuildRate(user, id)
	user.Module().Router().Post(prefix+"/login", p.login, rate, cmfx.Unlimit(user.Module().Server()), user.Module().API(func(o *openapi.Operation) {
		o.Tag("auth").
			Desc(web.Phrase("login by %s api", id), nil).
			Body(accountTO{}, false, nil, nil).
			Response("201", token.Response{}, nil, nil)
	}))

	user.Module().Router().Prefix(prefix, user).
		Post("", p.postBind, p.user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("bind %s passport for current user api", id), nil).
				Body(codeTO{}, false, nil, nil).
				ResponseEmpty("201")
		})).
		Delete("", p.deleteTOTP, p.user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("delete %s passport for current user api", id), nil).
				ResponseEmpty("204")
		})).
		Post("/secret", p.postSecret, rate, cmfx.Unlimit(user.Module().Server()), p.user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("request secret for %s passport api", id), nil).
				Response("201", secretVO{}, nil, nil)
		})).
		Delete("/secret", p.deleteSecret, rate, p.user.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("delete secret for %s passport api", id), nil).
				ResponseEmpty("204")
		}))

	user.AddPassport(p)

	return p
}

func (p *totp) ID() string { return p.id }

func (p *totp) Description() web.LocaleStringer { return p.desc }

func (p *totp) Delete(uid int64) error {
	_, err := p.db.Delete(&accountPO{UID: uid})
	return err
}

func (p *totp) Identity(uid int64) (string, int8) {
	if u, err := p.user.GetUser(uid); err != nil {
		p.user.Module().Server().Logs().ERROR().Error(err)
		return "", -1
	} else {
		mod := &accountPO{UID: u.ID}
		if found, err := p.db.Select(mod); err != nil {
			p.user.Module().Server().Logs().ERROR().Error(err)
			return "", -1
		} else if !found {
			return "", -1
		}

		state := int8(0)
		if !mod.Binded.Valid {
			state = 1
		}
		return u.Username, state
	}
}

// 请求绑定之前需要服务端创建一个密钥
func (p *totp) postSecret(ctx *web.Context) web.Responser {
	u := p.user.CurrentUser(ctx)

	mod := &accountPO{UID: u.ID}
	found, err := p.db.Select(mod)
	switch {
	case err != nil:
		return ctx.Error(err, "")
	case found && mod.Binded.Valid: // 已经绑定
		return ctx.Problem(problemHasBind)
	}

	n := &accountPO{
		Requested: ctx.Begin(), // 每次都要更新请求时间，否则在绑定时可能会判定超时未绑定。
		UID:       u.ID,
		Secret:    p.user.Module().Server().UniqueID(),
	}
	if _, _, err := p.db.Save(n); err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(&secretVO{
		Secret:   n.Secret,
		Username: u.Username,
		Expired:  secretExpiredInSeconds,
	}, "")
}

func (p *totp) deleteTOTP(ctx *web.Context) web.Responser {
	u := p.user.CurrentUser(ctx)

	if err := p.Delete(u.ID); err != nil {
		return ctx.Error(err, "")
	}

	if err := p.user.AddSecurityLogFromContext(nil, u.ID, ctx, web.Phrase("delete %s", p.ID())); err != nil {
		p.user.Module().Server().Logs().ERROR().Error(err)
	}
	return web.NoContent()
}

// 执行登录操作
func (p *totp) login(ctx *web.Context) web.Responser {
	data := &accountTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	u, err := p.user.GetUserByUsername(data.Username)
	if err != nil {
		return ctx.Error(err, "")
	}

	mod := &accountPO{UID: u.ID}
	found, err := p.db.Select(mod)
	if err != nil {
		return ctx.Error(err, "")
	} else if !found { // 未创建该类型的登录方式
		return ctx.Problem(cmfx.Unauthorized)
	}

	if valid(data.Code, mod.Secret) {
		return ctx.Problem(cmfx.Unauthorized)
	}
	return p.user.CreateToken(ctx, u, p)
}

// 绑定 totp 码
//
// 需要 /passports/xx/secret 作为前置
func (p *totp) postBind(ctx *web.Context) web.Responser {
	u := p.user.CurrentUser(ctx)
	m := &accountPO{UID: u.ID}
	found, err := p.db.Select(m)
	switch {
	case err != nil:
		return ctx.Error(err, "")
	case !found:
		return ctx.Problem(problemNeedSecret)
	case m.Binded.Valid: // 已关联用户
		return ctx.Problem(problemHasBind)
	case m.Requested.Add(secretExpired).Before(ctx.Begin()): // 超时还未绑定
		if err := p.Delete(u.ID); err != nil {
			p.user.Module().Server().Logs().ERROR().Error(err)
		}
		return ctx.Problem(problemSecretExpired)
	}

	data := &codeTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}
	if !valid(data.Code, m.Secret) {
		return ctx.Problem(cmfx.BadRequestInvalidBody).WithParam("code", locales.InvalidValue.LocaleString(ctx.LocalePrinter()))
	}

	mod := &accountPO{
		ID:     m.ID,
		UID:    u.ID,
		Binded: sql.NullTime{Time: ctx.Begin(), Valid: true},
	}
	if _, err := p.db.Update(mod); err != nil {
		return ctx.Error(err, "")
	}

	if err := p.user.AddSecurityLogFromContext(nil, u.ID, ctx, web.Phrase("bind %s", p.ID())); err != nil {
		p.user.Module().Server().Logs().ERROR().Error(err)
	}
	return web.Created(nil, "")
}

func valid(code, secret string) bool {
	// 将时间戳转换为字节数组
	msg := make([]byte, 8)
	binary.BigEndian.PutUint64(msg, uint64(time.Now().Unix()/30))
	h := hmac.New(sha1.New, []byte(secret))
	h.Write(msg)
	hmacHash := h.Sum(nil)

	// 获取偏移量
	offset := hmacHash[len(hmacHash)-1] & 0xf
	binaryCode := ((int32(hmacHash[offset]) & 0x7f) << 24) |
		((int32(hmacHash[offset+1] & 0xff)) << 16) |
		((int32(hmacHash[offset+2] & 0xff)) << 8) |
		(int32(hmacHash[offset+3]) & 0xff)

	const digitLen = 6

	otp := int(binaryCode) % int(math.Pow10(digitLen))
	result := strconv.Itoa(otp)
	for len(result) < digitLen { // 补齐前导的 0
		result = "0" + result
	}

	return result == code
}

// 删除当前用户的安全码
func (p *totp) deleteSecret(ctx *web.Context) web.Responser {
	u := p.user.CurrentUser(ctx)

	m := &accountPO{UID: u.ID}
	if _, err := p.db.Delete(m); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}
