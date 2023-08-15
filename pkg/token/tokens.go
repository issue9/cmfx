// SPDX-License-Identifier: MIT

// Package token 令牌管理
package token

import (
	"time"

	"github.com/issue9/middleware/v6/jwt"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
	"github.com/issue9/web/cache"
)

// Tokens 令牌管理
type Tokens struct {
	*jwt.JWT[*Claims]

	log web.Logger

	cache          cache.Cache // 保存运行时的过期 token
	blockerExpired time.Duration

	db       *orm.DB
	dbPrefix orm.Prefix
}

// NewTokens 声明 token 管理对象
//
// expires 表示 token 的过期时间，单位为秒；
// refreshes 表示刷新令牌的过期时间，单位为秒，如果为 0 则采用用 expires * 2 作为默认值；
// jobTitle 表示后台回收 token 服务的显示名称；
func NewTokens(s *web.Server, mod string, db *orm.DB, expires, refreshes int, jobTitle web.LocaleStringer) (*Tokens, error) {
	if refreshes == 0 {
		refreshes = expires * 2
	}

	expired := time.Duration(expires) * time.Second
	refreshed := time.Duration(refreshes) * time.Second
	tks := &Tokens{
		log: s.Logs().ERROR(),

		cache:          cache.Prefix(s.Cache(), mod+"_"),
		blockerExpired: refreshed,

		dbPrefix: orm.Prefix(mod),
		db:       db,
	}
	tks.JWT = jwt.New[*Claims](tks, buildClaims, expired, refreshed, nil)

	if err := tks.loadData(); err != nil {
		return nil, err
	}

	s.Services().AddTicker(jobTitle, tks.scanJob, tks.blockerExpired, false, false)

	return tks, nil
}

func (tks *Tokens) loadData() error {
	now := time.Now()
	e := tks.dbPrefix.DB(tks.db)

	tokens := make([]*blockedToken, 0, 100)
	if _, err := e.Where("1=1").Select(true, &tokens); err != nil {
		return web.NewStackError(err)
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
		return web.NewStackError(err)
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

func (tks *Tokens) scanJob(now time.Time) error {
	e := tks.dbPrefix.DB(tks.db)

	if _, err := e.Where("expired<?", now).Delete(&blockedToken{}); err != nil {
		return web.NewStackError(err)
	}

	_, err := e.Where("expired<?", now).Delete(&discardUser{})
	return web.NewStackError(err)
}

func (tks *Tokens) TokenIsBlocked(token string) bool {
	return tks.cache.Exists(token)
}

func (tks *Tokens) ClaimsIsBlocked(c *Claims) bool {
	return tks.cache.Exists(c.User)
}

// BlockToken 丢弃令牌
//
// 时长为 New 中传递的 expired 的两倍。
func (tks *Tokens) BlockToken(token string) error {
	e := tks.dbPrefix.DB(tks.db)
	_, err := e.Insert(&blockedToken{Token: token, Expired: time.Now().Add(tks.blockerExpired)})
	if err != nil {
		tks.log.Error(err)
	}
	return tks.blockCacheToken(token)
}

func (tks *Tokens) blockCacheToken(token string) error {
	if tks.cache.Exists(token) {
		if err := tks.cache.Delete(token); err != nil {
			return web.NewStackError(err)
		}
	}
	// 不知道丢弃的是令牌还是刷新令牌，两者时间不一样，一律按刷新令牌处理。
	return web.NewStackError(tks.cache.Set(token, struct{}{}, tks.blockerExpired))
}

// BlockUID 丢弃 User 关联的所有令牌
//
// 时长为 New 中传递的 expires 的两倍。
// 包括后续生成的令牌，一般用于禁止用户登录等操作。
func (tks *Tokens) BlockUID(uid string) error {
	e := tks.dbPrefix.DB(tks.db)
	_, err := e.Insert(&discardUser{UserID: uid, Expired: time.Now().Add(tks.blockerExpired)})
	if err != nil {
		tks.log.Error(err)
	}
	return tks.blockCacheUID(uid)
}

func (tks *Tokens) blockCacheUID(uid string) error {
	if tks.cache.Exists(uid) {
		if err := tks.cache.Delete(uid); err != nil {
			return web.NewStackError(err)
		}
	}
	// 不知道丢弃的是令牌还是刷新令牌，两者时间不一样，一律按刷新令牌处理。
	return web.NewStackError(tks.cache.Set(uid, struct{}{}, tks.blockerExpired))
}

// RecoverUID 恢复该用户的登录权限
func (tks *Tokens) RecoverUID(uid string) error {
	e := tks.dbPrefix.DB(tks.db)
	_, err := e.Delete(&discardUser{UserID: uid})
	if err != nil {
		tks.log.Error(err)
	}
	return tks.recoverCacheUID(uid)
}

func (tks *Tokens) recoverCacheUID(uid string) error {
	return web.NewStackError(tks.cache.Delete(uid))
}

// New 签发新的令牌
//
// access 普通的访问令牌；
// refresh 刷新令牌；
func (tks *Tokens) New(ctx *web.Context, status int, access *Claims) web.Responser {
	return tks.Render(ctx, status, access)
}
