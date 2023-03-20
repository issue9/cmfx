// SPDX-License-Identifier: MIT

package admin

import "github.com/issue9/web"

var (
	_ web.CTXFilter = &adminsQuery{}
	_ web.CTXFilter = &postAdminInfo{}
)
