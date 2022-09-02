// SPDX-License-Identifier: MIT

package cmfx

import (
	"net/http"

	"github.com/issue9/web"
	"github.com/issue9/web/server"
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
)

// 403
const (
	Forbidden                    = "40300"
	ForbiddenStateNotAllow       = "40301"
	ForbiddenCaNotDeleteYourself = "40302"
)

type status struct {
	status int
	p      *server.Problems
}

func (s *status) add(id string, title, detail web.LocaleStringer) *status {
	s.p.Add(id, s.status, title, detail)
	return s
}

func AddProblems(p *server.Problems) {
	s := &status{p: p, status: http.StatusBadRequest}
	s.add(BadRequest, web.Phrase("bad request"), web.Phrase("bad request")).
		add(BadRequestInvalidParam, web.Phrase("bad request invalid param"), web.Phrase("bad request invalid param detail")).
		add(BadRequestInvalidQuery, web.Phrase("bad request invalid query"), web.Phrase("bad request invalid query detail")).
		add(BadRequestInvalidHeader, web.Phrase("bad request invalid header"), web.Phrase("bad request invalid header detail")).
		add(BadRequestInvalidBody, web.Phrase("bad request invalid body"), web.Phrase("bad request invalid body detail"))

	s = &status{p: p, status: http.StatusUnauthorized}
	s.add(Unauthorized, web.Phrase("unauthorized"), web.Phrase("unauthorized detail")).
		add(UnauthorizedInvalidState, web.Phrase("unauthorized invalid state"), web.Phrase("unauthorized invalid state detail")).
		add(UnauthorizedInvalidToken, web.Phrase("unauthorized invalid token"), web.Phrase("unauthorized invalid token detail")).
		add(UnauthorizedInvalidPassword, web.Phrase("unauthorized invalid password"), web.Phrase("unauthorized invalid password detail")).
		add(UnauthorizedInvalidAccount, web.Phrase("unauthorized invalid account"), web.Phrase("unauthorized invalid account detail")).
		add(UnauthorizedNeedChangePassword, web.Phrase("unauthorized need change password"), web.Phrase("unauthorized need change password detail"))

	s = &status{p: p, status: http.StatusForbidden}
	s.add(Forbidden, web.Phrase("forbidden"), web.Phrase("forbidden detail")).
		add(ForbiddenStateNotAllow, web.Phrase("forbidden state not allow"), web.Phrase("forbidden state not allow detail")).
		add(ForbiddenCaNotDeleteYourself, web.Phrase("forbidden can not delete yourself"), web.Phrase("forbidden can not delete yourself detail"))
}
