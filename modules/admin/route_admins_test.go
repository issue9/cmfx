// SPDX-License-Identifier: MIT

package admin

import "github.com/issue9/web"

var (
	_ web.CTXSanitizer = &adminsQuery{}
	_ web.CTXSanitizer = &postAdminInfo{}
)
