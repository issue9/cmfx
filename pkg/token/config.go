// SPDX-License-Identifier: MIT

package token

import (
	"strconv"
	"time"

	gojwt "github.com/golang-jwt/jwt/v4"
	"github.com/issue9/web/app"
)

type Config struct {
	// expires 表示令牌的过期时间，单位为秒；
	Expired int `xml:"expired,attr" json:"expired" yaml:"expired"`
	expired time.Duration

	// 表示刷新令牌的过期时间，单位为秒，要长于 expired。
	// 同时也被作为丢弃令牌的回收时间。
	// 如果为零，则自动赋值为 Expired * 2。
	Refreshed int `xml:"refreshed,attr" json:"refreshed" yaml:"refreshed"`
	refreshed time.Duration

	HMAC []*hmac `xml:"hmac" json:"hmac" yaml:"hmac"`
	// TODO: 添加 RSA 等
}

type hmac struct {
	ID     string `json:"id" xml:"id" yaml:"id"`
	Method string `json:"method" xml:"method" yaml:"method"`
	Secret string `json:"secret" xml:"secret" yaml:"secret"`

	method *gojwt.SigningMethodHMAC
	secret []byte
}

func (cnf *Config) SanitizeConfig() *app.ConfigError {
	for i, h := range cnf.HMAC {
		if err := h.sanitizeConfig(); err != nil {
			err.Field = "hmac[" + strconv.Itoa(i) + "]." + err.Field
			return err
		}
	}

	if cnf.Expired < 60 {
		return &app.ConfigError{Field: "expired", Message: "不能少于 60"}
	}

	if cnf.Refreshed == 0 {
		cnf.Refreshed = cnf.Expired * 2
	}
	if cnf.Refreshed <= cnf.Expired {
		return &app.ConfigError{Field: "refreshed", Message: "必须大于 expired"}
	}

	cnf.expired = time.Second * time.Duration(cnf.Expired)
	cnf.refreshed = time.Second * time.Duration(cnf.Refreshed)

	return nil
}

func (h *hmac) sanitizeConfig() *app.ConfigError {
	if h.Secret == "" {
		return &app.ConfigError{Field: "secret", Message: "不能为空"}
	}
	h.secret = []byte(h.Secret)

	if h.ID == "" {
		return &app.ConfigError{Field: "id", Message: "不能为空"}
	}

	method := gojwt.GetSigningMethod(h.Method)
	if method == nil {
		return &app.ConfigError{Field: "method", Message: "无效的值"}
	}

	if h.method = method.(*gojwt.SigningMethodHMAC); h.method == nil {
		return &app.ConfigError{Field: "method", Message: "无效的值"}
	}

	return nil
}

func (tks *Tokens[T]) addHMAC(hmac *hmac) {
	tks.signer.AddHMAC(hmac.ID, hmac.method, hmac.secret)
	tks.verifier.AddHMAC(hmac.ID, hmac.method, hmac.secret)
}

func (tks *Tokens[T]) addKeys(cnf *Config) {
	for _, h := range cnf.HMAC {
		tks.addHMAC(h)
	}
}
