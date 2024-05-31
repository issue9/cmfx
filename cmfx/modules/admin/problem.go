// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"net/http"

	"github.com/issue9/web"
)

const (
	forbiddenIsSuper   = "admin-40001"
	forbiddenOnlySuper = "admin-40002"
)

func addProblems(s web.Server) {
	p := s.Problems()

	if !p.Exists(forbiddenIsSuper) {
		p.Add(http.StatusForbidden, &web.LocaleProblem{ID: forbiddenIsSuper, Title: web.StringPhrase("can not do it for super"), Detail: web.StringPhrase("can not do it for super detail")})
	}

	if !p.Exists(forbiddenOnlySuper) {
		p.Add(http.StatusForbidden, &web.LocaleProblem{ID: forbiddenOnlySuper, Title: web.StringPhrase("only for super"), Detail: web.StringPhrase("only for super detail")})
	}
}
