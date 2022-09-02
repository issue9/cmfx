// SPDX-License-Identifier: MIT

package passport

import (
	"net/url"

	"github.com/issue9/web"
)

// TODO: openid
type OAuth struct {
	auth *Passport

	vendor      string
	id, secret  string
	authURL     string
	tokenURL    string
	redirectURL string
}

// OAuth 添加以 OAuth 验证的方式
//
// vendor OAuth 提供的商家 ID；
// authURL 为第三方验证登录页面；
// tokenURL 为从第三方获取 access_token 的页面；
// redirectURL 为传递给 authURL 的跳转页面；
func (p *Passport) OAuth(vendor, id, secret, authURL, tokenURL, redirectURL string) *OAuth {
	q := url.Values{}
	q.Add("redirect_url", redirectURL) // TODO: 参数名可自定义
	q.Add("client_id", id)

	return &OAuth{
		auth: p,

		vendor:      vendor,
		id:          id,
		secret:      secret,
		authURL:     authURL + "?" + q.Encode(),
		tokenURL:    tokenURL,
		redirectURL: redirectURL,
	}
}

func (a *OAuth) AuthorizeURL() string { return a.authURL }

// Receive 接口令牌
func (o *OAuth) Receive(ctx *web.Context) web.Responser {
	q, err := ctx.Queries(true)
	if err != nil {
		return ctx.InternalServerError(err)
	}

	code := q.String("code", "") // 可自定义
	if code == "" {
		// TODO
	}

	// TODO: request access_token

	// TODO: save token

	return ctx.NotImplemented()
}
