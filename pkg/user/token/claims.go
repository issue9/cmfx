// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package token

import (
	"time"

	gojwt "github.com/golang-jwt/jwt/v5"
	"github.com/issue9/middleware/v6/auth/jwt"
)

type claims struct {
	Created time.Time `json:"iat"`
	User    string    `json:"iss"`
	Expires int64     `json:"exp"`            // 过期时间
	Base    string    `json:"base,omitempty"` // 原始令牌，如果为刷新令牌，此值为关联的令牌，否则为空。
	ID      string    `json:"jti"`            // 当用户快速更换令牌时，此值可以保证令牌的唯一性。
}

func buildClaims() *claims { return &claims{} }

func (c *claims) GetExpirationTime() (*gojwt.NumericDate, error) {
	return &gojwt.NumericDate{Time: time.Unix(c.Expires, 0)}, nil
}

func (c *claims) GetIssuedAt() (*gojwt.NumericDate, error) {
	return &gojwt.NumericDate{Time: c.Created}, nil
}

func (c *claims) GetNotBefore() (*gojwt.NumericDate, error) {
	return nil, nil
}

func (c *claims) GetIssuer() (string, error) { return c.User, nil }

func (c *claims) GetSubject() (string, error) { return "", nil }

func (c *claims) GetAudience() (gojwt.ClaimStrings, error) {
	return nil, nil
}

func (c *claims) SetExpired(t time.Duration) {
	c.Expires = time.Now().Add(t).Unix()
}

func (c *claims) BaseToken() string { return c.Base }

func (c *claims) BuildRefresh(token string) jwt.Claims {
	return &claims{
		User: c.User,
		Base: token,
		ID:   c.ID,
	}
}
