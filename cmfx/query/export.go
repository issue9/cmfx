// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package query

import (
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

const (
	excelMimetype = "application/vnd.ms-excel"
	csvMimetype   = "text/csv"
	odsMimetype   = "application/vnd.oasis.opendocument.spreadsheet"
)

//go:generate web enum -i=./export.go -o=./export_methods.go -t=ExportType

const (
	ExportTypeCSV   ExportType = iota // 导出为 CSV
	ExportTypeExcel                   // 导出为 Excel
	ExportTypeODS                     // 导出为 ODS
)

// ExportType 导出数据表的类型
//
// @enum
// @type string
type ExportType int8

// Export 导出数据
//
// m 为字段对应的名称。
func Export(ctx *web.Context, sql *sqlbuilder.SelectStmt, t ExportType, m map[string]string, name string) web.Responser {
	switch t {
	case ExportTypeCSV:
		return exportCSV(ctx, sql, m, name)
	case ExportTypeExcel:
		return exportExcel(ctx, sql, m, name)
	case ExportTypeODS:
		return exportODS(ctx, sql, m, name)
	default:
		return ctx.Problem(cmfx.BadRequestInvalidQuery)
	}
}

func exportCSV(ctx *web.Context, sql *sqlbuilder.SelectStmt, m map[string]string, name string) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

func exportExcel(ctx *web.Context, sql *sqlbuilder.SelectStmt, m map[string]string, name string) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

func exportODS(ctx *web.Context, sql *sqlbuilder.SelectStmt, m map[string]string, name string) web.Responser {
	// TODO
	return ctx.NotImplemented()
}
