// SPDX-License-Identifier: MIT

package cmfx

import (
	"net/http"

	"github.com/issue9/web"
)

// 定义可用的错误代码
const (
	BadRequest              = "40000"
	BadRequestInvalidParam  = "40001"
	BadRequestInvalidQuery  = "40002"
	BadRequestInvalidHeader = "40003"
	BadRequestInvalidBody   = "40004"
)

// 401
const (
	Unauthorized                   = "40100"
	UnauthorizedInvalidState       = "40101"
	UnauthorizedInvalidToken       = "40102"
	UnauthorizedInvalidPassword    = "40103"
	UnauthorizedInvalidAccount     = "40104"
	UnauthorizedNeedChangePassword = "40105"

	// 可注册的状态，比如 OAuth2 验证，如果未注册，返回一个 ID 可用以注册。
	UnauthorizedRegistrable = "40106"
)

// 403
const (
	Forbidden                    = "40300"
	ForbiddenStateNotAllow       = "40301"
	ForbiddenCaNotDeleteYourself = "40302"
)

type StatusProblem struct {
	s      *web.Server
	status int
}

func (p *StatusProblem) Add(id string, title, detail web.LocaleStringer) *StatusProblem {
	p.s.AddProblem(id, p.status, title, detail)
	return p
}

func NewStatusProblem(s *web.Server, status int) *StatusProblem {
	return &StatusProblem{s: s, status: status}
}

func AddProblems(p *web.Server) {
	s := NewStatusProblem(p, http.StatusBadRequest)
	s.Add(BadRequest, web.Phrase("bad request"), web.Phrase("bad request")).
		Add(BadRequestInvalidParam, web.Phrase("bad request invalid param"), web.Phrase("bad request invalid param detail")).
		Add(BadRequestInvalidQuery, web.Phrase("bad request invalid query"), web.Phrase("bad request invalid query detail")).
		Add(BadRequestInvalidHeader, web.Phrase("bad request invalid header"), web.Phrase("bad request invalid header detail")).
		Add(BadRequestInvalidBody, web.Phrase("bad request invalid body"), web.Phrase("bad request invalid body detail"))

	s = NewStatusProblem(p, http.StatusUnauthorized)
	s.Add(Unauthorized, web.Phrase("unauthorized"), web.Phrase("unauthorized detail")).
		Add(UnauthorizedInvalidState, web.Phrase("unauthorized invalid state"), web.Phrase("unauthorized invalid state detail")).
		Add(UnauthorizedInvalidToken, web.Phrase("unauthorized invalid token"), web.Phrase("unauthorized invalid token detail")).
		Add(UnauthorizedInvalidPassword, web.Phrase("unauthorized invalid password"), web.Phrase("unauthorized invalid password detail")).
		Add(UnauthorizedInvalidAccount, web.Phrase("unauthorized invalid account"), web.Phrase("unauthorized invalid account detail")).
		Add(UnauthorizedNeedChangePassword, web.Phrase("unauthorized need change password"), web.Phrase("unauthorized need change password detail")).
		Add(UnauthorizedRegistrable, web.Phrase("identity registrable"), web.Phrase("identity registrable detail"))

	s = NewStatusProblem(p, http.StatusForbidden)
	s.Add(Forbidden, web.Phrase("forbidden"), web.Phrase("forbidden detail")).
		Add(ForbiddenStateNotAllow, web.Phrase("forbidden state not allow"), web.Phrase("forbidden state not allow detail")).
		Add(ForbiddenCaNotDeleteYourself, web.Phrase("forbidden can not delete yourself"), web.Phrase("forbidden can not delete yourself detail"))
}
