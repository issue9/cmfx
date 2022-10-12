// SPDX-License-Identifier: MIT

package admin

import (
	"strconv"
	"strings"

	gojwt "github.com/golang-jwt/jwt/v4"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
	"github.com/issue9/web/app"

	"github.com/issue9/cmfx/locales"
	"github.com/issue9/cmfx/pkg/token"
)

type Options struct {
	// URLPrefix 所有 admin 地址的统一前缀
	URLPrefix string `json:"urlPrefix,omitempty" xml:"urlPrefix,omitempty" yaml:"urlPrefix,omitempty"`

	// Token

	// access token 的过期时间，单位为秒。
	AccessExpires int `json:"accessExpires,omitempty" xml:"accessExpires,attr,omitempty" yaml:"accessExpires,omitempty"`

	// refresh token 的过期时间，单位为秒。
	RefreshExpires int `json:"refreshExpires,omitempty" xml:"refreshExpires,attr,omitempty" yaml:"refreshExpires,omitempty"`

	// 支持的所有算法
	Algorithms []*Algorithm `json:"algorithms,omitempty" xml:"algorithm,omitempty" yaml:"algorithms,omitempty"`
}

type Algorithm struct {
	// 算法的类型
	//
	// 有以下可用值：
	//  - hmac
	//  - rsa
	//  - rspss
	//  - ecdsa
	//  - ed25519
	Type string `json:"type" yaml:"type" xml:"type,attr"`

	// 算法的名称
	Name string `json:"name" yaml:"name" xml:"name"`

	// 公钥
	//
	// 如果是 hmac 类型，那么该值必须与 Private 相同
	Public string `json:"public" yaml:"public" xml:"public"`

	// 私钥
	//
	// 如果是 hmac 类型，那么该值必须与 Public 相同
	Private string `json:"private" yaml:"private" xml:"private"`

	sign     gojwt.SigningMethod
	pub, pvt []byte
}

// SanitizeConfig 用于检测和修正配置项的内容
//
// [New] 中并未主动调用该方法，使用者需要自行调用。
func (o *Options) SanitizeConfig() *app.ConfigError {
	if o.URLPrefix == "" {
		return &app.ConfigError{Field: "urlPrefix", Message: locales.Required}
	}

	if o.AccessExpires < 60 {
		return &app.ConfigError{Field: "accessExpires", Message: "不能少于 60"}
	}

	if o.RefreshExpires == 0 {
		o.RefreshExpires = o.AccessExpires * 2
	}
	if o.RefreshExpires <= o.AccessExpires {
		return &app.ConfigError{Field: "refreshExpires", Message: "必须大于 accessExpires"}
	}

	if len(o.Algorithms) == 0 {
		return &app.ConfigError{Field: "algorithms", Message: locales.Required}
	}

	for i, alg := range o.Algorithms {
		if err := alg.sanitize(); err != nil {
			err.Field = "algorithms[" + strconv.Itoa(i) + "]." + err.Field
			return err
		}
	}

	return nil
}

func (alg *Algorithm) sanitize() *app.ConfigError {
	alg.sign = gojwt.GetSigningMethod(alg.Name)
	if alg.sign == nil {
		return &app.ConfigError{Field: "name", Message: locales.InvalidValue}
	}

	if alg.Public == "" {
		return &app.ConfigError{Field: "public", Message: locales.Required}
	}
	alg.pub = []byte(alg.Public)

	if alg.Private == "" {
		return &app.ConfigError{Field: "private", Message: locales.Required}
	}
	alg.pvt = []byte(alg.Private)

	switch strings.ToLower(alg.Type) {
	case "hmac":
		if _, ok := alg.sign.(*gojwt.SigningMethodHMAC); !ok {
			return &app.ConfigError{Field: "name", Message: locales.InvalidValue}
		}
		if alg.Public != alg.Private {
			return &app.ConfigError{Field: "private", Message: locales.InvalidValue}
		}
	case "rsa":
		if _, ok := alg.sign.(*gojwt.SigningMethodRSA); !ok {
			return &app.ConfigError{Field: "name", Message: locales.InvalidValue}
		}
	case "raspss":
		if _, ok := alg.sign.(*gojwt.SigningMethodRSAPSS); !ok {
			return &app.ConfigError{Field: "name", Message: locales.InvalidValue}
		}
	case "ecdsa":
		if _, ok := alg.sign.(*gojwt.SigningMethodECDSA); !ok {
			return &app.ConfigError{Field: "name", Message: locales.InvalidValue}
		}
	case "ed25519":
		if _, ok := alg.sign.(*gojwt.SigningMethodEd25519); !ok {
			return &app.ConfigError{Field: "name", Message: locales.InvalidValue}
		}
	default:
		return &app.ConfigError{Field: "type", Message: locales.InvalidValue}
	}

	return nil
}

func (o *Options) buildTokens(s *web.Server, mod string, db *orm.DB, jobTitle string) (*token.Tokens[*claims], error) {
	tks, err := token.NewTokens(s, mod, db, buildClaims, o.AccessExpires, o.RefreshExpires, jobTitle)
	if err != nil {
		return nil, err
	}

	for index, alg := range o.Algorithms {
		tks.Add(strconv.Itoa(index), alg.sign, alg.pub, alg.pvt)
	}

	return tks, nil
}
