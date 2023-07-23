// SPDX-License-Identifier: MIT

package token

import (
	"time"

	gojwt "github.com/golang-jwt/jwt/v5"
	"github.com/issue9/middleware/v6/jwt"
	"github.com/issue9/web"
)

// Claims 自定义 Claims 需要实现的接口
type Claims interface {
	jwt.Claims

	// UserID 获取用户的唯一编号
	//
	// 可以关联某一用户的所有登录令牌。
	UserID() string

	// BaseToken 关联的基础令牌
	//
	// 仅在刷新令牌中，此值不为空。
	BaseToken() string
}

type defaultClaims struct {
	Created time.Time `json:"iat"`
	User    string    `json:"iss"`
	Expires int64     `json:"exp"` // 过期时间
	Claims  string    `json:"clm"` // 原始令牌，如果为刷新令牌，此值为关联的令牌，否则为空。
	ID      string    `json:"jti"` // 当用户快速更换令牌时，此值可以保证令牌的唯一性。
}

func NewClaims(ctx *web.Context, uid string) Claims {
	return &defaultClaims{User: uid, ID: ctx.Server().UniqueID()}
}

func BuildClaims() Claims { return &defaultClaims{} }

func (c *defaultClaims) GetExpirationTime() (*gojwt.NumericDate, error) {
	return &gojwt.NumericDate{Time: time.Unix(c.Expires, 0)}, nil
}

func (c *defaultClaims) GetIssuedAt() (*gojwt.NumericDate, error) {
	return &gojwt.NumericDate{Time: c.Created}, nil
}

func (c *defaultClaims) GetNotBefore() (*gojwt.NumericDate, error) {
	return nil, nil
}

func (c *defaultClaims) GetIssuer() (string, error) { return "", nil }

func (c *defaultClaims) GetSubject() (string, error) { return "", nil }

func (c *defaultClaims) GetAudience() (gojwt.ClaimStrings, error) {
	return nil, nil
}

func (c *defaultClaims) UserID() string { return c.User }

func (c *defaultClaims) SetExpired(t time.Duration) {
	c.Expires = time.Now().Add(t).Unix()
}

func (c *defaultClaims) BaseToken() string { return c.Claims }

func (c *defaultClaims) BuildRefresh(token string) jwt.Claims {
	return &defaultClaims{
		User:   c.User,
		Claims: token,
		ID:     c.ID,
	}
}
