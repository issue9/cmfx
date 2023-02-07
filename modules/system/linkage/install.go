// SPDX-License-Identifier: MIT

package linkage

import (
	"errors"
	"fmt"

	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

func Install(s *web.Server, tableName string, db *orm.DB) {
	p := orm.Prefix(tableName)
	e := p.DB(db)
	cmfx.Init(s, nil, func() error {
		return web.NewStackError(e.Create(&linkageModel{}))
	})
}

// Install 初始化数据
func (r *Root[T]) Install(items []*Item[T]) error {
	if len(r.Items) > 0 { // 如果 r.Items 不为空，表示数据库有数据，则不能再次初始化。
		return fmt.Errorf("非空对象，不能再次安装数据。")
	}

	tx, err := r.linkage.db.Begin()
	if err != nil {
		return err
	}

	e := r.linkage.dbPrefix.Tx(tx)
	if err := r.install(e, 0, items); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	return tx.Commit()
}

func (r *Root[T]) install(engine orm.ModelEngine, parent int64, items []*Item[T]) error {
	if len(r.Items) > 0 { // 如果 r.Items 不为空，表示数据库有数据，则不能再次初始化。
		return fmt.Errorf("非空对象，不能再次安装数据。")
	}

	for _, item := range items {
		data, err := marshal(item.Data)
		if err != nil {
			return err
		}

		mod := &linkageModel{
			Key:    r.key,
			Data:   data,
			Parent: parent,
		}
		item.ID, err = engine.LastInsertID(mod)
		if err != nil {
			return err
		}

		if len(item.Items) > 0 {
			return r.install(engine, item.ID, item.Items)
		}
	}

	return nil
}
