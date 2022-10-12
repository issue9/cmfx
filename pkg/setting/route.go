// SPDX-License-Identifier: MIT

package setting

import (
	"reflect"
	"sort"

	"github.com/issue9/conv"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/locales"
	"github.com/issue9/cmfx/pkg/rules"
)

type (
	Response struct {
		XMLName struct{}         `json:"-" xml:"settings"`
		Groups  []*GroupResponse `json:"groups,omitempty" xml:"groups,omitempty"`
	}

	GroupResponse struct {
		XMLName struct{}        `json:"-" xml:"group"`
		ID      string          `json:"id" xml:"id,attr"`
		Title   string          `json:"title" xml:"title"`
		Desc    string          `json:"desc" xml:"desc"`
		Items   []*ItemResponse `json:"items,omitempty" xml:"item,omitempty"`
	}

	ItemResponse struct {
		ID       string `json:"id" xml:"id,attr"`
		Title    string `json:"title" xml:"title"`
		Desc     string `json:"desc" xml:"desc"`
		Value    any    `json:"value" xml:"value"`
		Type     string `json:"type,omitempty" xml:"type,attr,omitempty"`
		Multiple bool   `json:"multiple,omitempty" xml:"multiple,attr,omitempty"`
		Slice    bool   `json:"slice,omitempty" xml:"slice,attr,omitempty"`

		Candidate []*CandidateResponse `json:"candidate,omitempty" xml:"candidate,omitempty"`
	}

	CandidateResponse struct {
		Value any    `json:"value" xml:"value"`
		Title string `json:"title" xml:"title"`
		Desc  string `json:"desc,omitempty" xml:"desc,omitempty"`
	}

	Request struct {
		s       *Setting
		XMLName struct{}        `json:"-" xml:"setting"`
		Groups  []*GroupRequest `json:"groups,omitempty" xml:"group,omitempty"`
	}

	GroupRequest struct {
		g       *Group
		XMLName struct{}       `json:"-" xml:"group"`
		ID      string         `json:"id,omitempty" xml:"id,attr,omitempty"`
		Items   []*ItemRequest `json:"items" xml:"item"`
	}

	ItemRequest struct {
		ID       string   `json:"id" xml:"id,attr"`
		Value    any      `json:"value" xml:"-"`
		XMLValue []string `json:"-" xml:"value"` // XML 无法解析到 any 类型
	}
)

func (r *Request) CTXSanitize(v *web.Validation) {
	v.AddField(r.Groups, "groups", rules.Required)

	for _, g := range r.Groups {
		g.g = r.s.groups[g.ID]
		v.AddField(g.ID, "id", rules.Required)
		g.CTXSanitize(v)
	}
}

func (g *GroupRequest) CTXSanitize(v *web.Validation) {
	if len(g.Items) == 0 {
		v.Add("items", locales.Required)
		return
	}

	v.AddSliceField(g.Items, "items", web.NewRuleFunc(locales.NotInCandidate, func(a any) bool {
		i := a.(*ItemRequest)

		attr := g.g.attr.fields[i.ID]
		if len(attr.candidate) == 0 {
			return true
		}

		val := i.getValue(attr)
		if !attr.slice {
			for _, v := range attr.candidate {
				if v.Value == val {
					return true
				}
			}
			return false
		}

		rv := reflect.ValueOf(val)
		if rv.Kind() != reflect.Slice {
			return false
		}

	LOOP:
		for i := 0; i < rv.Len(); i++ {
			for _, v := range attr.candidate {
				if v.Value == rv.Index(i).Interface() {
					continue LOOP
				}
			}
			return false
		}
		return true
	}))
}

func (i *ItemRequest) getValue(a *fieldAttribute) any {
	val := i.Value
	if val == nil && len(i.XMLValue) > 0 {
		if a.slice {
			val = i.XMLValue
		} else {
			val = i.XMLValue[0]
		}
	}
	return val
}

// HandlePut 更新设置项
func (g *Group) HandlePut(ctx *web.Context) web.Responser {
	gg := &GroupRequest{g: g}
	if resp := ctx.Read(true, gg, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := g.fromRequest(gg.Items); err != nil {
		return ctx.InternalServerError(err)
	}
	return web.NoContent()
}

func (g *Group) fromRequest(items []*ItemRequest) error {
	v := reflect.New(g.attr.t).Elem()

	for _, item := range items {
		i := g.attr.fields[item.ID]
		vv := v.Field(i.index)
		val := item.getValue(i)
		if err := conv.Value(val, vv); err != nil {
			return err
		}
	}
	g.v.Set(v)

	return g.s.store.Update(g.attr.id, v.Interface())
}

// HandleGet 获取设置项
func (g *Group) HandleGet(ctx *web.Context) web.Responser {
	p := ctx.LocalePrinter()

	gg := &GroupResponse{
		ID:    g.attr.id,
		Title: g.attr.title.LocaleString(p),
		Desc:  g.attr.desc.LocaleString(p),
		Items: make([]*ItemResponse, 0, len(g.attr.fields)),
	}
	for _, attr := range g.attr.fields {
		c := make([]*CandidateResponse, 0, len(attr.candidate))
		for _, cc := range attr.candidate {
			c = append(c, &CandidateResponse{
				Value: cc.Value,
				Title: cc.Title.LocaleString(p),
				Desc:  cc.Desc.LocaleString(p),
			})
		}

		gg.Items = append(gg.Items, &ItemResponse{
			ID:        attr.id,
			Title:     attr.title.LocaleString(p),
			Desc:      attr.desc.LocaleString(p),
			Value:     g.v.Field(attr.index).Interface(),
			Type:      attr.typ,
			Candidate: c,
			Multiple:  attr.multiple,
			Slice:     attr.slice,
		})
	}
	sort.Slice(gg.Items, func(i, j int) bool { return gg.Items[i].ID < gg.Items[j].ID })
	return web.OK(gg)
}

func (s *Setting) HandlePatch(ctx *web.Context) web.Responser {
	uu := &Request{s: s}
	if resp := ctx.Read(true, uu, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	for _, gg := range uu.Groups {
		g := s.groups[gg.ID]
		if err := g.fromRequest(gg.Items); err != nil {
			return ctx.InternalServerError(err)
		}
	}

	return web.NoContent()
}

// HandleGet 获取当前用户的所有设置项
func (s *Setting) HandleGet(ctx *web.Context) web.Responser {
	p := ctx.LocalePrinter()

	uu := &Response{
		Groups: make([]*GroupResponse, 0, len(s.groups)),
	}
	for _, g := range s.groups {
		gs := &GroupResponse{
			ID:    g.attr.id,
			Title: g.attr.title.LocaleString(p),
			Desc:  g.attr.desc.LocaleString(p),
			Items: make([]*ItemResponse, 0, len(g.attr.fields)),
		}

		for _, f := range g.attr.fields {
			item := &ItemResponse{
				ID:       f.id,
				Title:    f.title.LocaleString(p),
				Desc:     f.desc.LocaleString(p),
				Value:    g.v.Field(f.index).Interface(),
				Type:     f.typ,
				Multiple: f.multiple,
				Slice:    f.slice,
			}
			item.Candidate = make([]*CandidateResponse, 0, len(f.candidate))
			for _, c := range f.candidate {
				item.Candidate = append(item.Candidate, &CandidateResponse{
					Value: c.Value,
					Title: c.Title.LocaleString(p),
					Desc:  c.Desc.LocaleString(p),
				})
			}

			gs.Items = append(gs.Items, item)

		}
		sort.Slice(gs.Items, func(i, j int) bool { return gs.Items[i].ID < gs.Items[j].ID })
		uu.Groups = append(uu.Groups, gs)
	}

	sort.Slice(uu.Groups, func(i, j int) bool { return uu.Groups[i].ID < uu.Groups[j].ID })
	return web.OK(uu)
}
