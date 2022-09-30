// SPDX-License-Identifier: MIT

package setting

import (
	"net/http"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

var (
	_ web.CTXSanitizer = &GroupRequest{}
	_ web.CTXSanitizer = &Request{}
)

func TestHandleGet(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	r := suite.NewRouter()

	s := New(newMemoryStore())
	a.NotNil(s)

	obj := &testConfig{}
	g1, err := s.Register(obj, "g1", web.Phrase("g1 title"), web.Phrase("g1 desc"), attrs)
	a.NotError(err).NotNil(g1)
	obj.ID = 5 // NewGroup 之后作了修改
	obj.Name = "g1"
	obj.Tags = []string{"t1", "t2"}

	obj = &testConfig{}
	g2, err := s.Register(obj, "g2", web.Phrase("g2 title"), web.Phrase("g2 desc"), attrs)
	a.NotError(err).NotNil(g2)
	obj.ID = 3
	obj.Name = "g2"

	r.Get("/group/1", func(ctx *web.Context) web.Responser {
		return g1.HandleGet(ctx)
	})

	r.Get("/setting", func(ctx *web.Context) web.Responser {
		return s.HandleGet(ctx)
	})

	suite.GoServe()
	defer suite.Close()

	t.Run("group/JSON", func(t *testing.T) {
		suite.Get("/group/1").Header("Accept", "application/json").
			Do(nil).
			Status(http.StatusOK).
			StringBody(`{"id":"g1","title":"g1 title","desc":"g1 desc","items":[{"id":"Name","title":"name","desc":"name desc","value":"g1","type":"string"},{"id":"id","title":"id","desc":"id desc","value":5,"type":"number"},{"id":"tags","title":"tags","desc":"tags desc","value":["t1","t2"],"type":"string","multiple":true,"slice":true,"candidate":[{"value":"1","title":"1","desc":"1 desc"},{"value":"2","title":"2","desc":"2 desc"},{"value":"3","title":"3","desc":"3 desc"},{"value":"4","title":"4","desc":"4 desc"},{"value":"5","title":"5","desc":"5 desc"}]}]}`)
	})

	t.Run("group/XML", func(t *testing.T) {
		suite.Get("/group/1").Header("Accept", "application/xml").
			Do(nil).
			Status(http.StatusOK).
			StringBody(`<group id="g1"><title>g1 title</title><desc>g1 desc</desc><item id="Name" type="string"><title>name</title><desc>name desc</desc><value>g1</value></item><item id="id" type="number"><title>id</title><desc>id desc</desc><value>5</value></item><item id="tags" type="string" multiple="true" slice="true"><title>tags</title><desc>tags desc</desc><value>t1</value><value>t2</value><candidate><value>1</value><title>1</title><desc>1 desc</desc></candidate><candidate><value>2</value><title>2</title><desc>2 desc</desc></candidate><candidate><value>3</value><title>3</title><desc>3 desc</desc></candidate><candidate><value>4</value><title>4</title><desc>4 desc</desc></candidate><candidate><value>5</value><title>5</title><desc>5 desc</desc></candidate></item></group>`)
	})

	t.Run("setting/JSON", func(t *testing.T) {
		suite.Get("/setting").Header("Accept", "application/json").
			Do(nil).
			Status(http.StatusOK).
			StringBody(`{"groups":[{"id":"g1","title":"g1 title","desc":"g1 desc"},{"id":"g2","title":"g2 title","desc":"g2 desc"}]}`)
	})

	t.Run("setting/XML", func(t *testing.T) {
		suite.Get("/setting").Header("Accept", "application/xml").
			Do(nil).
			Status(http.StatusOK).
			StringBody(`<setting><group id="g1"><title>g1 title</title><desc>g1 desc</desc></group><group id="g2"><title>g2 title</title><desc>g2 desc</desc></group></setting>`)
	})
}

func TestHandlePut(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	r := suite.NewRouter()

	s := New(newMemoryStore())
	a.NotNil(s)

	obj := &testConfig{}
	g1, err := s.Register(obj, "g1", web.Phrase("g1 title"), web.Phrase("g1 desc"), attrs)
	a.NotError(err).NotNil(g1)
	obj.ID = 5
	obj.Name = "g1"
	obj.Tags = []string{"1", "2"}

	obj2 := &testConfig{}
	g2, err := s.Register(obj2, "g2", web.Phrase("g2 title"), web.Phrase("g2 desc"), attrs)
	a.NotError(err).NotNil(g2)
	obj2.ID = 3
	obj2.Name = "g2"

	r.Put("/group/1", func(ctx *web.Context) web.Responser {
		return g1.HandlePut(ctx)
	})

	r.Put("/setting", func(ctx *web.Context) web.Responser {
		return s.HandlePut(ctx)
	})

	suite.GoServe()
	defer suite.Close()

	t.Run("group/JSON ==> 400", func(t *testing.T) {
		data := `{"items":[{"id":"id","value":7},{"id":"Name","value":"json"},{"id":"tags","value":["tt1","tt2"]}]}`
		suite.NewRequest(http.MethodPut, "/group/1", nil).Header("content-type", "application/json").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusBadRequest). // tags 不在候选列表中
			StringBody(`{"type":"40004","title":"bad request invalid body","status":400,"params":[{"name":"items[2]","reason":"the value not in candidate"}]}`)
	})

	t.Run("group/JSON ==> 204", func(t *testing.T) {
		data := `{"items":[{"id":"id","value":7},{"id":"Name","value":"json"},{"id":"tags","value":["3","4"]}]}`
		suite.NewRequest(http.MethodPut, "/group/1", nil).Header("content-type", "application/json").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusNoContent).
			StringBody("")
		a.Equal(obj, &testConfig{ID: 7, Name: "json", Tags: []string{"3", "4"}})
	})

	// 提交了空对象
	t.Run("setting/JSON ==> 400", func(t *testing.T) {
		data := `{"items":[{"id":"id","value":7},{"id":"Name","value":"json"},{"id":"tags","value":["3","4"]}]}`
		suite.NewRequest(http.MethodPut, "/setting", nil).Header("content-type", "application/json").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusBadRequest).
			BodyNotEmpty("")
	})

	// 少 group.id
	t.Run("setting/JSON ==> 400", func(t *testing.T) {
		data := `{"groups":[{"items":[{"id":"id","value":7},{"id":"Name","value":"json"},{"id":"tags","value":["3","4"]}]}]}`
		suite.NewRequest(http.MethodPut, "/setting", nil).Header("content-type", "application/json").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusBadRequest).
			BodyNotEmpty("")
	})

	t.Run("setting/JSON ==> 204", func(t *testing.T) {
		data := `{"groups":[{"id":"g1","items":[{"id":"id","value":7},{"id":"Name","value":"json"},{"id":"tags","value":["3","5"]}]}]}`
		suite.NewRequest(http.MethodPut, "/setting", nil).Header("content-type", "application/json").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusNoContent)
		a.Equal(obj, &testConfig{ID: 7, Name: "json", Tags: []string{"3", "5"}})
	})

	t.Run("group/XML ==> 204", func(t *testing.T) {
		data := `<group><item id="id"><value>8</value></item><item id="Name"><value>xml</value></item><item id="tags"><value>1</value><value>3</value></item></group>`
		suite.NewRequest(http.MethodPut, "/group/1", nil).Header("content-type", "application/xml").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusNoContent)
		a.Equal(obj, &testConfig{ID: 8, Name: "xml", Tags: []string{"1", "3"}})
	})

	t.Run("group/XML ==> 204", func(t *testing.T) {
		data := `<group><item id="id"><value>8</value></item><item id="Name"><value>xml</value></item><item id="tags"><value>1</value></item></group>`
		suite.NewRequest(http.MethodPut, "/group/1", nil).Header("content-type", "application/xml").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusNoContent)
		a.Equal(obj, &testConfig{ID: 8, Name: "xml", Tags: []string{"1"}})
	})

	t.Run("group/XML ==> 400", func(t *testing.T) {
		data := `<group><item id="id"><value>8</value></item><item id="Name"><value>xml</value></item><item id="tags"><value>1</value><value>not-exists</value></item></group>`
		suite.NewRequest(http.MethodPut, "/group/1", nil).Header("content-type", "application/xml").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusBadRequest).
			BodyNotEmpty()
	})

	// 提交了空对象
	t.Run("setting/XML ==> 400", func(t *testing.T) {
		data := `<group><item id="id"><value>8</value></item><item id="Name"><value>xml</value></item><item id="tags"><value>1</value><value>3</value></item></group>`
		suite.NewRequest(http.MethodPut, "/setting", nil).Header("content-type", "application/xml").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusUnprocessableEntity). // 格式不正确
			BodyNotEmpty("")
	})

	// 少 group.id
	t.Run("setting/XML ==> 400", func(t *testing.T) {
		data := `<setting><group><item id="id"><value>8</value></item><item id="Name"><value>xml</value></item><item id="tags"><value>1</value><value>3</value></item></group></setting>`
		suite.NewRequest(http.MethodPut, "/setting", nil).Header("content-type", "application/xml").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusBadRequest).
			BodyNotEmpty("")
	})

	t.Run("setting/XML ==> 204", func(t *testing.T) {
		data := `<setting><group id="g1"><item id="id"><value>8</value></item><item id="Name"><value>xml</value></item><item id="tags"><value>1</value><value>3</value></item></group></setting>`
		suite.NewRequest(http.MethodPut, "/setting", nil).Header("content-type", "application/xml").
			Body([]byte(data)).
			Do(nil).
			Status(http.StatusNoContent)
		a.Equal(obj, &testConfig{ID: 8, Name: "xml", Tags: []string{"1", "3"}})
	})
}
