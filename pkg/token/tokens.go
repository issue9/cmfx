// SPDX-License-Identifier: MIT

// Package token 令牌管理
package token

import (
	"time"

	"github.com/issue9/cache"
	"github.com/issue9/middleware/v6/jwt"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
)

type BuildResponseFunc = func() jwt.Responser

// Tokens 令牌管理
type Tokens[T Claims] struct {
	signer   *jwt.Signer
	verifier *jwt.Verifier[T]
	br       BuildResponseFunc

	log web.Logger

	cache          cache.Access
	blockerExpires int
	blockerExpired time.Duration

	db       *orm.DB
	dbPrefix orm.Prefix
}

// NewTokens 声明令牌管理对象
func NewTokens[T Claims](mod string, s *web.Server, db *orm.DB, bc jwt.BuildClaimsFunc[T], cnf *Config, jobTitle string) (*Tokens[T], error) {
	tks := &Tokens[T]{
		signer: jwt.NewSigner(cnf.expired, cnf.refreshed),
		br: func() jwt.Responser {
			return &jwt.Response{}
		},

		log: s.Logs().ERROR(),

		cache:          cache.Prefix(mod+"_", s.Cache()),
		blockerExpires: cnf.Refreshed,
		blockerExpired: cnf.refreshed,

		dbPrefix: orm.Prefix(mod),
		db:       db,
	}
	tks.verifier = jwt.NewVerifier[T](tks, bc)

	if err := tks.loadData(); err != nil {
		return nil, err
	}

	s.Services().AddTicker(jobTitle, tks.scanJob, tks.blockerExpired, false, false)

	tks.addKeys(cnf)

	return tks, nil
}

func (tks *Tokens[T]) loadData() error {
	now := time.Now()
	e := tks.dbPrefix.DB(tks.db)

	tokens := make([]*blockedToken, 0, 100)
	if _, err := e.Where("1=1").Select(true, &tokens); err != nil {
		return web.StackError(err)
	}
	for _, t := range tokens {
		if t.Expired.Before(now) {
			continue
		}
		if err := tks.blockCacheToken(t.Token); err != nil {
			return err
		}
	}

	users := make([]*discardUser, 0, 100)
	if _, err := e.Where("1=1").Select(true, &users); err != nil {
		return web.StackError(err)
	}
	for _, t := range users {
		if t.Expired.Before(now) {
			continue
		}
		if err := tks.blockCacheUID(t.UserID); err != nil {
			return err
		}
	}

	return nil
}

func (tks *Tokens[T]) scanJob(now time.Time) error {
	e := tks.dbPrefix.DB(tks.db)

	if _, err := e.Where("expired<?", now).Delete(&blockedToken{}); err != nil {
		return web.StackError(err)
	}

	_, err := e.Where("expired<?", now).Delete(&discardUser{})
	return web.StackError(err)
}

func (tks *Tokens[T]) TokenIsBlocked(token string) bool {
	return tks.cache.Exists(token)
}

func (tks *Tokens[T]) ClaimsIsBlocked(c T) bool {
	return tks.cache.Exists(c.UserID())
}

// BlockToken 丢弃令牌
//
// 时长为 New 中传递的 expired 的两倍。
func (tks *Tokens[T]) BlockToken(token string) error {
	e := tks.dbPrefix.DB(tks.db)
	_, err := e.Insert(&blockedToken{Token: token, Expired: time.Now().Add(tks.blockerExpired)})
	if err != nil {
		tks.log.Error(err)
	}
	return tks.blockCacheToken(token)
}

func (tks *Tokens[T]) blockCacheToken(token string) error {
	if tks.cache.Exists(token) {
		if err := tks.cache.Delete(token); err != nil {
			return web.StackError(err)
		}
	}
	// 不知道丢弃的是令牌还是刷新令牌，两者时间不一样，一律按刷新令牌处理。
	return web.StackError(tks.cache.Set(token, struct{}{}, tks.blockerExpires))
}

// BlockUID 丢弃 UserID 关联的所有令牌
//
// 时长为 New 中传递的 expires 的两倍。
// 包括后续生成的令牌，一般用于禁止用户登录等操作。
func (tks *Tokens[T]) BlockUID(uid string) error {
	e := tks.dbPrefix.DB(tks.db)
	_, err := e.Insert(&discardUser{UserID: uid, Expired: time.Now().Add(tks.blockerExpired)})
	if err != nil {
		tks.log.Error(err)
	}
	return tks.blockCacheUID(uid)
}

func (tks *Tokens[T]) blockCacheUID(uid string) error {
	if tks.cache.Exists(uid) {
		if err := tks.cache.Delete(uid); err != nil {
			return web.StackError(err)
		}
	}
	// 不知道丢弃的是令牌还是刷新令牌，两者时间不一样，一律按刷新令牌处理。
	return web.StackError(tks.cache.Set(uid, struct{}{}, tks.blockerExpires))
}

// RecoverUID 恢复该用户的登录权限
func (tks *Tokens[T]) RecoverUID(uid string) error {
	e := tks.dbPrefix.DB(tks.db)
	_, err := e.Delete(&discardUser{UserID: uid})
	if err != nil {
		tks.log.Error(err)
	}
	return tks.recoverCacheUID(uid)
}

func (tks *Tokens[T]) recoverCacheUID(uid string) error {
	return web.StackError(tks.cache.Delete(uid))
}

// New 签发新的令牌
//
// access 普通的访问令牌；
// refresh 刷新令牌；
func (tks *Tokens[T]) New(ctx *web.Context, status int, access T) web.Responser {
	return tks.signer.Render(ctx, status, tks.br(), access)
}

func (tks *Tokens[T]) GetValue(ctx *web.Context) (T, bool) {
	return tks.verifier.GetValue(ctx)
}

func (tks *Tokens[T]) GetToken(ctx *web.Context) string {
	return tks.verifier.GetToken(ctx)
}

func (tks *Tokens[T]) Middleware(next web.HandlerFunc) web.HandlerFunc {
	return tks.verifier.Middleware(next)
}
