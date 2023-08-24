// SPDX-License-Identifier: MIT

package admin

import (
	"net/http"
	"sync"

	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

var once = &sync.Once{}

const (
	forbiddenIsSuper   = "admin-40001"
	forbiddenOnlySuper = "admin-40002"
)

func loadProblems(s *web.Server) {
	once.Do(func() {
		cmfx.NewStatusProblem(s, http.StatusForbidden).
			Add(forbiddenIsSuper, web.StringPhrase("can not do it for super"), web.StringPhrase("can not do it for super detail")).
			Add(forbiddenOnlySuper, web.StringPhrase("only for super"), web.StringPhrase("only for super detail"))
	})
}
