// SPDX-License-Identifier: MIT

package admin

import (
	"strconv"
	"time"

	gojwt "github.com/golang-jwt/jwt/v5"
	"github.com/issue9/middleware/v6/jwt"
)

type claims struct {
	User    string `json:"iss"`
	Expires int64  `json:"exp"` // 过期时间
	Claims  string `json:"clm"` // 原始令牌，如果为刷新令牌，此值为关联的令牌，否则为空。
	ID      string `json:"jti"` // 当用户快速更换令牌时，此值可以保证令牌的唯一性。

	UID int64 `json:"uid"`
}

func newClaims(uid int64) *claims {
	return &claims{UID: uid, User: formatUID(uid)}
}

func formatUID(uid int64) string { return strconv.FormatInt(uid, 36) }

func buildClaims() *claims { return &claims{} }

func (c *claims) UserID() string { return c.User }

func (c *claims) SetExpired(t time.Duration) {
	c.Expires = time.Now().Add(t).Unix()
}

func (c *claims) BaseToken() string { return c.Claims }

func (c *claims) BuildRefresh(token string) jwt.Claims {
	return &claims{
		User:   c.User,
		Claims: token,
		ID:     c.ID,
		UID:    c.UID,
	}
}

func (c *claims) GetExpirationTime() (*gojwt.NumericDate, error) {
	return &gojwt.NumericDate{Time: time.Unix(c.Expires, 0)}, nil
}

func (c *claims) GetIssuedAt() (*gojwt.NumericDate, error) { return nil, nil }

func (c *claims) GetNotBefore() (*gojwt.NumericDate, error) { return nil, nil }

func (c *claims) GetIssuer() (string, error) { return "", nil }

func (c *claims) GetSubject() (string, error) { return "", nil }

func (c *claims) GetAudience() (gojwt.ClaimStrings, error) { return nil, nil }
