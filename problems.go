// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmfx

import (
	"net/http"

	"github.com/issue9/web"
)

// 定义可用的错误代码
const (
	BadRequest              = web.ProblemBadRequest
	BadRequestInvalidPath   = "40001"
	BadRequestInvalidQuery  = "40002"
	BadRequestInvalidHeader = "40003"
	BadRequestInvalidBody   = "40004"
)

// 401
const (
	Unauthorized                   = web.ProblemUnauthorized
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
	Forbidden                    = web.ProblemForbidden
	ForbiddenStateNotAllow       = "40301"
	ForbiddenCaNotDeleteYourself = "40302"
)

func AddProblems(s web.Server) {
	s.Problems().Add(http.StatusBadRequest,
		&web.LocaleProblem{ID: BadRequestInvalidPath, Title: web.StringPhrase("bad request invalid param"), Detail: web.StringPhrase("bad request invalid param detail")},
		&web.LocaleProblem{ID: BadRequestInvalidQuery, Title: web.StringPhrase("bad request invalid query"), Detail: web.StringPhrase("bad request invalid query detail")},
		&web.LocaleProblem{ID: BadRequestInvalidHeader, Title: web.StringPhrase("bad request invalid header"), Detail: web.StringPhrase("bad request invalid header detail")},
		&web.LocaleProblem{ID: BadRequestInvalidBody, Title: web.StringPhrase("bad request invalid body"), Detail: web.StringPhrase("bad request invalid body detail")},
	).Add(http.StatusUnauthorized,
		&web.LocaleProblem{ID: UnauthorizedInvalidState, Title: web.StringPhrase("unauthorized invalid state"), Detail: web.StringPhrase("unauthorized invalid state detail")},
		&web.LocaleProblem{ID: UnauthorizedInvalidToken, Title: web.StringPhrase("unauthorized invalid token"), Detail: web.StringPhrase("unauthorized invalid token detail")},
		&web.LocaleProblem{ID: UnauthorizedInvalidPassword, Title: web.StringPhrase("unauthorized invalid password"), Detail: web.StringPhrase("unauthorized invalid password detail")},
		&web.LocaleProblem{ID: UnauthorizedInvalidAccount, Title: web.StringPhrase("unauthorized invalid account"), Detail: web.StringPhrase("unauthorized invalid account detail")},
		&web.LocaleProblem{ID: UnauthorizedNeedChangePassword, Title: web.StringPhrase("unauthorized need change password"), Detail: web.StringPhrase("unauthorized need change password detail")},
		&web.LocaleProblem{ID: UnauthorizedRegistrable, Title: web.StringPhrase("identity registrable"), Detail: web.StringPhrase("identity registrable detail")},
	).Add(http.StatusForbidden,
		&web.LocaleProblem{ID: ForbiddenStateNotAllow, Title: web.StringPhrase("forbidden state not allow"), Detail: web.StringPhrase("forbidden state not allow detail")},
		&web.LocaleProblem{ID: ForbiddenCaNotDeleteYourself, Title: web.StringPhrase("forbidden can not delete yourself"), Detail: web.StringPhrase("forbidden can not delete yourself detail")},
	)
}
