// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

package admin

import "github.com/issue9/web"

func (m *Module) getDepartments(ctx *web.Context) web.Responser {
	return m.deps.HandleGetLinkages(ctx)
}

func (m *Module) postDepartments(ctx *web.Context) web.Responser {
	return m.deps.HandlePostLinkage(ctx, "id")
}

func (m *Module) putDepartment(ctx *web.Context) web.Responser {
	return m.deps.HandlePutLinkage(ctx, "id")
}

func (m *Module) deleteDepartment(ctx *web.Context) web.Responser {
	return m.deps.HandleDeleteLinkage(ctx, "id")
}
