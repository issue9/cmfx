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

func loadOnce(s *web.Server) {
	once.Do(func() {
		s.Problems().Add(forbiddenIsSuper, http.StatusForbidden, web.Phrase("can not do it for super"), web.Phrase("can not do it for super detail"))
		s.Problems().Add(forbiddenOnlySuper, http.StatusForbidden, web.Phrase("only for super"), web.Phrase("only for super detail"))
	})
}
