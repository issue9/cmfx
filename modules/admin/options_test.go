// SPDX-License-Identifier: MIT

package admin

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web/app"
)

var _ app.ConfigSanitizer = &Options{}

func TestOptions_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	o := &Options{}
	a.Equal(o.SanitizeConfig().Field, "urlPrefix")

	o = &Options{URLPrefix: "/admin"}
	a.Equal(o.SanitizeConfig().Field, "accessExpires")
}
