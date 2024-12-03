// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package cmfx

import (
	"net/http"
	"os"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/logs/v7"
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/dialect"
	"github.com/issue9/web"
	"github.com/issue9/web/mimetype/json"
	"github.com/issue9/web/openapi"
	"github.com/issue9/web/server"

	_ "github.com/mattn/go-sqlite3"
)

func TestNewModule(t *testing.T) {
	a := assert.New(t, false)
	srv, err := server.NewHTTP("test", "1.0.0", &server.Options{
		Logs:       logs.New(logs.NewTermHandler(os.Stdout, nil), logs.WithLevels(logs.AllLevels()...), logs.WithCreated(logs.NanoLayout)),
		Codec:      web.NewCodec().AddMimetype(json.Mimetype, json.Marshal, json.Unmarshal, json.ProblemMimetype),
		HTTPServer: &http.Server{Addr: ":8080"},
	})
	a.NotError(err).NotNil(srv)

	const dbFile = "./sqlite3.db"

	db, err := orm.NewDB("", dbFile, dialect.Sqlite3("sqlite3"))
	a.NotError(err).NotNil(db)
	defer func() {
		a.NotError(db.Close())
		a.NotError(os.Remove(dbFile))
	}()

	r := srv.Routers().New("def", nil)
	doc := openapi.New(srv, web.Phrase("test"))

	mod := newModule("m1", web.Phrase("m1"), srv, db, r, doc)
	a.NotNil(mod).
		Equal(mod.ID(), "m1").
		Equal(mod.Server(), srv).
		NotEqual(mod.DB(), db).
		Equal(mod.DB().TablePrefix(), "m1").
		Equal(mod.Desc(), web.Phrase("m1")).
		Equal(mod.Router(), r)

	mod2 := mod.New("sub", web.Phrase("sub"))
	a.NotNil(mod2).
		Equal(mod2.ID(), "m1sub").
		Equal(mod2.Server(), srv).
		NotEqual(mod2.DB(), db).
		Equal(mod2.DB().TablePrefix(), "m1sub").
		Equal(mod2.Desc(), web.Phrase("sub")).
		Equal(mod2.Router(), r)

	mod3 := mod2.New("_sub", web.Phrase("sub"))
	a.NotNil(mod3).
		Equal(mod3.ID(), "m1sub_sub").
		Equal(mod3.DB().TablePrefix(), "m1sub_sub")

	a.PanicString(func() {
		doc := openapi.New(srv, web.Phrase("test"))
		newModule("m1sub", web.Phrase("m1sub"), srv, db, r, doc)
	}, "存在相同 id 的模块：m1sub")

	a.Equal(mod2.Engine(nil), mod2.DB())

	tx, err := mod2.DB().Begin()
	a.NotError(err).NotNil(tx).
		NotEqual(mod2.Engine(tx), mod2.DB()).
		NotError(tx.Rollback()) // 结束事务
}
