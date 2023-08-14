// SPDX-License-Identifier: MIT

package token

import (
	"time"

	gojwt "github.com/golang-jwt/jwt/v5"
	"github.com/issue9/middleware/v6/jwt"
	"github.com/issue9/web"
)

type Claims struct {
	Created time.Time `json:"iat"`
	User    string    `json:"iss"`
	Expires int64     `json:"exp"` // 过期时间
	Claims  string    `json:"clm"` // 原始令牌，如果为刷新令牌，此值为关联的令牌，否则为空。
	ID      string    `json:"jti"` // 当用户快速更换令牌时，此值可以保证令牌的唯一性。
}

func NewClaims(ctx *web.Context, uid string) *Claims {
	return &Claims{
		User: uid,
		ID:   ctx.Server().UniqueID(),
	}
}

func buildClaims() *Claims { return &Claims{} }

func (c *Claims) GetExpirationTime() (*gojwt.NumericDate, error) {
	return &gojwt.NumericDate{Time: time.Unix(c.Expires, 0)}, nil
}

func (c *Claims) GetIssuedAt() (*gojwt.NumericDate, error) {
	return &gojwt.NumericDate{Time: c.Created}, nil
}

func (c *Claims) GetNotBefore() (*gojwt.NumericDate, error) {
	return nil, nil
}

func (c *Claims) GetIssuer() (string, error) { return c.User, nil }

func (c *Claims) GetSubject() (string, error) { return "", nil }

func (c *Claims) GetAudience() (gojwt.ClaimStrings, error) {
	return nil, nil
}

func (c *Claims) SetExpired(t time.Duration) {
	c.Expires = time.Now().Add(t).Unix()
}

func (c *Claims) BaseToken() string { return c.Claims }

func (c *Claims) BuildRefresh(token string) jwt.Claims {
	return &Claims{
		User:   c.User,
		Claims: token,
		ID:     c.ID,
	}
}
