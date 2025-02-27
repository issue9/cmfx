// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/filters"
)

const (
	settingsTableName  = "settings"
	generalSettingName = "general"
	auditSettingName   = "audit"
)

// 后台的常规设置
type generalSettings struct {
	XMLName struct{} `setting:"-" json:"-" cbor:"-" xml:"general" yaml:"-"`

	// 网站名称
	Name string `setting:"name" json:"name" xml:"name" cbor:"name" yaml:"name"`

	// 网站短标题
	ShortName string `setting:"shortName" json:"shortName" xml:"shortName" cbor:"shortName" yaml:"shortName"`

	// 网站的 LOGO
	LOGO string `setting:"logo" json:"logo" xml:"logo" cbor:"logo" yaml:"logo"`

	// 网站描述
	Description string `setting:"description" json:"description" xml:"description" cbor:"description" yaml:"description"`
}

func (g *generalSettings) Filter(f *web.FilterContext) {
	f.Add(filters.NotEmpty("name", &g.Name)).
		Add(filters.NotEmpty("shortName", &g.ShortName)).
		Add(filters.NotEmpty("description", &g.Description)).
		Add(filters.URL("url", &g.LOGO))
}
