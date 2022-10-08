// SPDX-License-Identifier: MIT

package admin

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/middleware/v6/jwt"

	"github.com/issue9/cmfx/pkg/setting"
	"github.com/issue9/cmfx/pkg/test"
)

var _ setting.Store = &settingStore{}

func TestAdmin_getSettings(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	mod, _ := newAdmin(s)

	s.GoServe()
	defer s.Close()

	// 未登录
	s.Get(mod.URLPrefix()+"/settings").
		Header("accept", "application/json").
		Header("content-type", "application/json").
		Do(nil).
		Status(http.StatusUnauthorized)

	s.NewRequest(http.MethodPost, mod.URLPrefix()+"/login", nil).
		Header("accept", "application/json").
		Header("content-type", "application/json").
		Body([]byte(`{"username":"admin", "password":"123"}`)).
		Do(nil).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			c := &jwt.Response{}
			a.NotError(json.Unmarshal(body, c))

			token := c.Access
			s.Get(mod.URLPrefix()+"/settings").
				Header("accept", "application/json").
				Header("content-type", "application/json").
				Header("Authorization", token).
				Do(nil).
				Status(http.StatusOK).
				BodyFunc(func(a *assert.Assertion, body []byte) {
					us := &setting.Response{}
					a.NotError(json.Unmarshal(body, us))
					a.Equal(us.Groups[0].ID, "ui").
						Equal(us.Groups[0].Items[0].ID, "timezone").
						Equal(us.Groups[0].Items[0].Value, "Local") // 未修改，继承自 web.Server
				})
		})
}
