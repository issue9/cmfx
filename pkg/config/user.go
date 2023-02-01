// SPDX-License-Identifier: MIT

package config

import (
	"strconv"
	"strings"

	gojwt "github.com/golang-jwt/jwt/v4"
	"github.com/issue9/middleware/v6/jwt"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/locales"
	"github.com/issue9/cmfx/pkg/token"
)

// User 带有登录功能的模块配置
type User struct {
	// URLPrefix 路由地址的前缀
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
func (o *User) SanitizeConfig() *web.FieldError {
	if o.URLPrefix != "" && o.URLPrefix[0] != '/' {
		return web.NewFieldError("urlPrefix", locales.InvalidValue)
	}

	if o.AccessExpires < 60 {
		return web.NewFieldError("accessExpires", "不能少于 60")
	}

	if o.RefreshExpires == 0 {
		o.RefreshExpires = o.AccessExpires * 2
	}
	if o.RefreshExpires <= o.AccessExpires {
		return web.NewFieldError("refreshExpires", "必须大于 accessExpires")
	}

	if len(o.Algorithms) == 0 {
		return web.NewFieldError("algorithms", locales.Required)
	}

	for i, alg := range o.Algorithms {
		if err := alg.sanitize(); err != nil {
			err.Field = "algorithms[" + strconv.Itoa(i) + "]." + err.Field
			return err
		}
	}

	return nil
}

func (alg *Algorithm) sanitize() *web.FieldError {
	alg.sign = gojwt.GetSigningMethod(alg.Name)
	if alg.sign == nil {
		return web.NewFieldError("name", locales.InvalidValue)
	}

	if alg.Public == "" {
		return web.NewFieldError("public", locales.Required)
	}
	alg.pub = []byte(alg.Public)

	if alg.Private == "" {
		return web.NewFieldError("private", locales.Required)
	}
	alg.pvt = []byte(alg.Private)

	switch strings.ToLower(alg.Type) {
	case "hmac":
		if _, ok := alg.sign.(*gojwt.SigningMethodHMAC); !ok {
			return web.NewFieldError("name", locales.InvalidValue)
		}
		if alg.Public != alg.Private {
			return web.NewFieldError("private", locales.InvalidValue)
		}
	case "rsa":
		if _, ok := alg.sign.(*gojwt.SigningMethodRSA); !ok {
			return web.NewFieldError("name", locales.InvalidValue)
		}
	case "raspss":
		if _, ok := alg.sign.(*gojwt.SigningMethodRSAPSS); !ok {
			return web.NewFieldError("name", locales.InvalidValue)
		}
	case "ecdsa":
		if _, ok := alg.sign.(*gojwt.SigningMethodECDSA); !ok {
			return web.NewFieldError("name", locales.InvalidValue)
		}
	case "ed25519":
		if _, ok := alg.sign.(*gojwt.SigningMethodEd25519); !ok {
			return web.NewFieldError("name", locales.InvalidValue)
		}
	default:
		return web.NewFieldError("type", locales.InvalidValue)
	}

	return nil
}

// NewTokens 从配置中生成 tokens 对象
func NewTokens[T token.Claims](u *User, s *web.Server, mod string, db *orm.DB, bc jwt.BuildClaimsFunc[T], jobTitle string) (*token.Tokens[T], error) {
	tks, err := token.NewTokens(s, mod, db, bc, u.AccessExpires, u.RefreshExpires, jobTitle)
	if err != nil {
		return nil, err
	}

	for index, alg := range u.Algorithms {
		tks.Add(strconv.Itoa(index), alg.sign, alg.pub, alg.pvt)
	}

	return tks, nil
}
