// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/setting"
)

// NewSetting 声明一组新的设置组
func (s *System) NewSetting(id string, v any, title, desc web.LocaleStringer, attrs map[string]*setting.Attribute, notify func()) (*setting.Group, error) {
	return s.setting.NewGroup(id, v, title, desc, attrs, notify)
}

// <api method="GET" summary="所有的设置项">
//
//	<path path="/system/settings" />
//	<response status="200" array="true" type="object">
//	    <param name="id" type="number" summary="id" />
//	    <param name="desc" type="string" summary="description" />
//	    <param name="items" array="true" type="object" summary="items">
//	        <param name="key" type="string" summary="key" />
//	        <param name="desc" type="string" summary="description" />
//	        <param name="type" type="string" summary="type">
//	            <enum value="number" summary="number" />
//	            <enum value="bool" summary="bool" />
//	            <enum value="string" summary="string" />
//	        </param>
//	        <param name="multiple" type="bool" summary="multiple" />
//	        <param name="candidate" type="any" array="true" summary="candidate" />
//	    </param>
//	</response>
//
// </api>
func (s *System) adminGetSettings(ctx *web.Context) web.Responser {
	return s.setting.HandleGet(ctx)
}
