// SPDX-License-Identifier: MIT

package admin

import (
	"encoding/json"
	"fmt"

	"github.com/issue9/web"
	"golang.org/x/text/language/display"

	"github.com/issue9/cmfx/pkg/setting"
)

var uiAttrs = map[string]*setting.Attribute{
	"Timezone": {
		ID:       "timezone",
		Title:    web.Phrase("timezone"),
		Desc:     web.Phrase("timezone"),
		Multiple: false,
		Candidate: []setting.Candidate{
			{Value: "Local", Title: web.Phrase("server timezone"), Desc: web.Phrase("server timezone detail")},
			{Value: "Etc/GMT", Title: web.Phrase("GMT"), Desc: web.Phrase("GMT")},
			{Value: "Etc/GMT-1", Title: web.Phrase("GMT-1"), Desc: web.Phrase("GMT-1")},
			{Value: "Etc/GMT-2", Title: web.Phrase("GMT-2"), Desc: web.Phrase("GMT-2")},
			{Value: "Etc/GMT-3", Title: web.Phrase("GMT-3"), Desc: web.Phrase("GMT-3")},
			{Value: "Etc/GMT-4", Title: web.Phrase("GMT-4"), Desc: web.Phrase("GMT-4")},
			{Value: "Etc/GMT-5", Title: web.Phrase("GMT-5"), Desc: web.Phrase("GMT-5")},
			{Value: "Etc/GMT-6", Title: web.Phrase("GMT-6"), Desc: web.Phrase("GMT-6")},
			{Value: "Etc/GMT-7", Title: web.Phrase("GMT-7"), Desc: web.Phrase("GMT-7")},
			{Value: "Etc/GMT-8", Title: web.Phrase("GMT-8"), Desc: web.Phrase("GMT-8")},
			{Value: "Etc/GMT-9", Title: web.Phrase("GMT-9"), Desc: web.Phrase("GMT-9")},
			{Value: "Etc/GMT-10", Title: web.Phrase("GMT-10"), Desc: web.Phrase("GMT-10")},
			{Value: "Etc/GMT-11", Title: web.Phrase("GMT-11"), Desc: web.Phrase("GMT-11")},
			{Value: "Etc/GMT-12", Title: web.Phrase("GMT-12"), Desc: web.Phrase("GMT-12")},
			{Value: "Etc/GMT+1", Title: web.Phrase("GMT+1"), Desc: web.Phrase("GMT+1")},
			{Value: "Etc/GMT+2", Title: web.Phrase("GMT+2"), Desc: web.Phrase("GMT+2")},
			{Value: "Etc/GMT+3", Title: web.Phrase("GMT+3"), Desc: web.Phrase("GMT+3")},
			{Value: "Etc/GMT+4", Title: web.Phrase("GMT+4"), Desc: web.Phrase("GMT+4")},
			{Value: "Etc/GMT+5", Title: web.Phrase("GMT+5"), Desc: web.Phrase("GMT+5")},
			{Value: "Etc/GMT+6", Title: web.Phrase("GMT+6"), Desc: web.Phrase("GMT+6")},
			{Value: "Etc/GMT+7", Title: web.Phrase("GMT+7"), Desc: web.Phrase("GMT+7")},
			{Value: "Etc/GMT+8", Title: web.Phrase("GMT+8"), Desc: web.Phrase("GMT+8")},
			{Value: "Etc/GMT+9", Title: web.Phrase("GMT+9"), Desc: web.Phrase("GMT+9")},
			{Value: "Etc/GMT+10", Title: web.Phrase("GMT+10"), Desc: web.Phrase("GMT+10")},
			{Value: "Etc/GMT+11", Title: web.Phrase("GMT+11"), Desc: web.Phrase("GMT+11")},
			{Value: "Etc/GMT+12", Title: web.Phrase("GMT+12"), Desc: web.Phrase("GMT+12")},
		},
	},

	"Language": {
		ID:        "language",
		Title:     web.Phrase("ui language"),
		Desc:      web.Phrase("ui language detail"),
		Multiple:  false,
		Candidate: []setting.Candidate{}, // 在 initAttrs 中初始化
	},
}

type userSetting struct {
	Timezone string
	Language string
}

type settingStore struct {
	uid int64
	a   *Admin
}

func initAttrs(s *web.Server) {
	tags := s.CatalogBuilder().Languages()
	c := make([]setting.Candidate, 0, len(tags))
	for _, tag := range tags {
		c = append(c, setting.Candidate{
			Value: tag.String(),
			Title: web.Phrase(display.Self.Name(tag)),
			Desc:  web.Phrase(display.Self.Name(tag)),
		})
	}
	uiAttrs["Language"].Candidate = c
}

func (s *settingStore) Load(id string, v any) error {
	mod := &modelSetting{UID: s.uid, ID: id}
	e := s.a.dbPrefix.DB(s.a.db)

	found, err := e.Select(mod)
	if err != nil {
		return err
	}
	if !found { // 理论上不会出现此种情况
		panic(fmt.Sprintf("数据 %d-%s 不存在", s.uid, id))
	}

	return json.Unmarshal([]byte(mod.Value), v)
}

func (s *settingStore) Update(id string, v any) error {
	return s.save(false, id, v)
}

func (s *settingStore) Insert(id string, v any) error {
	return s.save(true, id, v)
}

func (s *settingStore) save(insert bool, id string, v any) error {
	text, err := json.Marshal(v)
	if err != nil {
		return err
	}

	e := s.a.dbPrefix.DB(s.a.db)
	if insert {
		_, err = e.Insert(&modelSetting{UID: s.uid, ID: id, Value: string(text)})
	} else {
		_, err = e.Update(&modelSetting{UID: s.uid, ID: id, Value: string(text)})
	}
	return err
}

func (s *settingStore) Exists(id string) (bool, error) {
	e := s.a.dbPrefix.DB(s.a.db)
	cnt, err := e.Where("uid=?", s.uid).And("id=?", id).Count(&modelSetting{})
	return cnt > 0, err
}

func (m *Admin) getSettings(ctx *web.Context) web.Responser {
	a := m.LoginUser(ctx)
	s, found := m.settings[a.ID]
	if !found {
		return ctx.NotFound()
	}
	return s.HandleGet(ctx)
}

func (m *Admin) patchSettings(ctx *web.Context) web.Responser {
	a := m.LoginUser(ctx)
	s, found := m.settings[a.ID]
	if !found {
		return ctx.NotFound()
	}
	return s.HandlePatch(ctx)
}
