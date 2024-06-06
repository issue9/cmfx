// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"regexp"
	"strings"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"
	"github.com/issue9/webfilter/validator"

	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/locales"
)

const settingsTableName = "settings"

// 后台的常规设置
type generalSettings struct {
	XMLName struct{} `setting:"-" json:"-" cbor:"-" xml:"general"`

	// 网站名称
	Name string `setting:"name" json:"name" xml:"name" cbor:"name"`

	// 网站短标题
	ShortName string `setting:"shortName" json:"shortName" xml:"shortName" cbor:"shortName"`

	// 网站的 LOGO
	LOGO string `setting:"logo" json:"logo" xml:"logo" cbor:"logo"`

	// 网站描述
	Description string `setting:"description" json:"description" xml:"description" cbor:"description"`
}

// 内容审核设置
type censorSettings struct {
	XMLName struct{} `setting:"-" json:"-" cbor:"-" xml:"censor"`

	// 关键字过滤
	Words []string `setting:"name" json:"name" xml:"name" cbor:"name"`

	// 正则表达式过滤
	Pattern string `setting:"pattern" json:"pattern" xml:"pattern" cbor:"pattern"`
	pattern *regexp.Regexp
}

func (c *censorSettings) SanitizeSettings() error {
	exp, err := regexp.Compile(c.Pattern)
	if err == nil {
		c.pattern = exp
	}
	return err
}

func (g *generalSettings) Filter(f *web.FilterContext) {
	f.Add(filters.NotEmpty("name", &g.Name)).
		Add(filters.NotEmpty("shortName", &g.ShortName)).
		Add(filters.NotEmpty("description", &g.Description)).
		Add(filters.URL("url", &g.LOGO))
}

func (c *censorSettings) Filter(f *web.FilterContext) {
	f.Add(filter.NewBuilder(filter.V(validator.Regexp, locales.InvalidFormat))("pattern", &c.Pattern))
}

// Censor 审核内容
func (m *Module) Censor(text string) (ok bool) {
	c, err := m.censorSettings.Get(user.SpecialUserID)
	if err != nil {
		m.mod.Server().Logs().ERROR().Error(err)
		return false
	}

	for _, word := range c.Words {
		if strings.Index(text, word) >= 0 {
			return false
		}
	}

	return !c.pattern.MatchString(text)
}
