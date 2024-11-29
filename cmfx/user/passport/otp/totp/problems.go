// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package totp

import (
	"net/http"

	"github.com/issue9/web"
)

const (
	problemHasBind       = "passports-totp-hasBind"    // 该账号已经绑定
	problemNeedSecret    = "passports-totp-needSecret" // 需要先创建 secret
	problemSecretExpired = "passports-totp-secretExpired"
)

func initProblems(s web.Server) {
	if s.Problems().Exists(problemHasBind) { // 防止多次添加
		return
	}

	s.Problems().Add(http.StatusConflict,
		&web.LocaleProblem{ID: problemHasBind, Title: web.Phrase("has been totp bind"), Detail: web.Phrase("has been bind totp detail")},
		&web.LocaleProblem{ID: problemNeedSecret, Title: web.Phrase("before bind need create secret"), Detail: web.Phrase("before bind need create secret detail")},
		&web.LocaleProblem{ID: problemSecretExpired, Title: web.Phrase("secret expired"), Detail: web.Phrase("secret expired detail")},
	)
}
