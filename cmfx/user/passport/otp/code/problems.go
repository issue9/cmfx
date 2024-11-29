// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"net/http"

	"github.com/issue9/web"
)

const (
	problemHasBind = "passports-code-hasBind" // 该账号已经绑定
)

func initProblems(s web.Server) {
	if s.Problems().Exists(problemHasBind) { // 防止多次添加
		return
	}

	s.Problems().Add(http.StatusConflict,
		&web.LocaleProblem{ID: problemHasBind, Title: web.Phrase("has been bind code"), Detail: web.Phrase("has been bind code detail")},
	)
}
