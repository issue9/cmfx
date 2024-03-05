// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"net/http"
	"sync"

	"github.com/issue9/web"
)

var once = &sync.Once{}

const (
	forbiddenIsSuper   = "admin-40001"
	forbiddenOnlySuper = "admin-40002"
)

func loadProblems(s web.Server) {
	once.Do(func() {
		s.Problems().Add(http.StatusForbidden,
			&web.LocaleProblem{ID: forbiddenIsSuper, Title: web.StringPhrase("can not do it for super"), Detail: web.StringPhrase("can not do it for super detail")},
			&web.LocaleProblem{ID: forbiddenOnlySuper, Title: web.StringPhrase("only for super"), Detail: web.StringPhrase("only for super detail")},
		)
	})
}
