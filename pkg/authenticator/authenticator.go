// SPDX-License-Identifier: MIT

// Package authenticator 验证器
package authenticator

import (
	"errors"
	"fmt"

	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
	"golang.org/x/text/message"
)

var (
	ErrExists = errors.New("user already exists")

	ErrUnauthorized = errors.New("unauthorized")
)

// Authenticators 验证器管理
type Authenticators struct {
	authenticators []*authInfo
}

// Authenticator 身份验证接口
type Authenticator interface {
	// Valid 验证账号
	Valid(username, password string) (int64, bool)

	// Identity 获取 uid 关联的账号名
	Identity(int64) (string, bool)
}

type authInfo struct {
	id   string
	name web.LocaleStringer
	auth Authenticator
}

func NewAuthenticators(cap int) *Authenticators {
	return &Authenticators{
		authenticators: make([]*authInfo, 0, cap),
	}
}

// Register 注册验证器
//
// id 为验证器的类型名称，需要唯一；
// name 为该验证器的本地化名称；
// logo 为该验证器的 LOGO；
func (a *Authenticators) Register(id string, auth Authenticator, name web.LocaleStringer) {
	if sliceutil.Exists(a.authenticators, func(info *authInfo) bool { return info.id == id }) {
		panic(fmt.Sprintf("已经存在同名 %s 的验证器", id))
	}

	a.authenticators = append(a.authenticators, &authInfo{
		id:   id,
		name: name,
		auth: auth,
	})
}

// Valid 验证账号密码
//
// id 表示通过 [Authenticators.Register] 注册验证器时的 id；
func (a *Authenticators) Valid(id, identity, password string) (uid int64, found bool) {
	if info, found := sliceutil.At(a.authenticators, func(info *authInfo) bool { return info.id == id }); found {
		return info.auth.Valid(identity, password)
	}
	return 0, false
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
