// SPDX-License-Identifier: MIT

// Package authenticator 用户验证
package authenticator

import (
	"fmt"
	"time"

	"github.com/issue9/web"
	"golang.org/x/text/message"
)

var (
	ErrExists       = web.NewLocaleError("user already exists")
	ErrUnauthorized = web.NewLocaleError("unauthorized")
)

// Authenticators 验证器管理
type Authenticators struct {
	authenticators map[string]*authInfo
	expired        time.Duration
}

// Authenticator 身份验证接口
type Authenticator interface {
	// Valid 验证账号
	//
	// username, password 向验证器提供的登录凭证，不同的实现对此两者的定义可能是不同的，
	// 比如 oauth2 中表示的是由 authURL 返回的 state 和 code 参数。
	// ok 表示是否验证成功；
	// uid 表示验证成功之后返回与 username 关联的用户 ID；
	// identity 表示验证成功，但是并未与任何 uid 绑定时，则返回该验证器验证之后的用户标记，仅当 uid 为 0 时此值才有效；
	Valid(username, password string) (uid int64, identity string, ok bool)

	// Identity 获取 uid 关联的账号名
	Identity(int64) (string, bool)
}

type authInfo struct {
	id         string
	name       web.LocaleStringer
	auth       Authenticator
	identities map[string]time.Time
}

// NewAuthenticators 声明 Authenticators 对象
//
// d 每个验证失败的 ID 过期时间同时也是回收的频率；
// jobTitle 回收方法的名称；
func NewAuthenticators(s *web.Server, d time.Duration, jobTitle web.LocaleStringer) *Authenticators {
	auth := &Authenticators{
		authenticators: make(map[string]*authInfo, 5),
		expired:        d,
	}
	s.Services().AddTicker(jobTitle, auth.gc, d, false, false)

	return auth
}

// Register 注册验证器
//
// id 为验证器的类型名称，需要唯一；
// name 为该验证器的本地化名称；
func (a *Authenticators) Register(id string, auth Authenticator, name web.LocaleStringer) {
	if _, found := a.authenticators[id]; found {
		panic(fmt.Sprintf("已经存在同名 %s 的验证器", id))
	}

	a.authenticators[id] = &authInfo{
		id:         id,
		name:       name,
		auth:       auth,
		identities: make(map[string]time.Time, 5),
	}
}

// Valid 验证账号密码
//
// id 表示通过 [Authenticators.Register] 注册验证器时的 id；
//
// 返回参数同 [Authenticator.Valid]
func (a *Authenticators) Valid(id, identity, password string) (int64, string, bool) {
	if info, found := a.authenticators[id]; found {
		uid, ident, ok := info.auth.Valid(identity, password)
		if ok {
			return uid, "", true
		} else if ident != "" {
			a.authenticators[id].identities[ident] = time.Now().Add(a.expired)
			return 0, identity, false
		}
	}
	return 0, "", false
}

// IdentityExpired 验证由 [Authenticator.Valid] 返回的值是否还能使用
func (a *Authenticators) IdentityExpired(id, identity string) bool {
	auth := a.authenticators[id]

	expired, found := auth.identities[identity]
	if !found {
		return false
	}

	if expired.Before(time.Now()) {
		delete(a.authenticators[id].identities, identity)
		return false
	}
	return true
}

// All 返回所有的验证器
func (a *Authenticators) All(p *message.Printer) map[string]string {
	m := make(map[string]string, len(a.authenticators))
	for _, i := range a.authenticators {
		m[i.id] = i.name.LocaleString(p)
	}
	return m
}

// Identities 获取 uid 已经关联的验证器
//
// 返回值键名为验证器 id，键值为该验证器对应的账号。
func (a *Authenticators) Identities(uid int64) map[string]string {
	m := make(map[string]string, len(a.authenticators))
	for _, info := range a.authenticators {
		if identity, found := info.auth.Identity(uid); found {
			m[info.id] = identity
		}
	}
	return m
}

// 执行回收过期 identity 的方法
func (a *Authenticators) gc(now time.Time) error {
	for _, auth := range a.authenticators {
		for k, v := range auth.identities {
			if v.Before(now) {
				delete(auth.identities, k)
			}
		}
	}
	return nil
}
