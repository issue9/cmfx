// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import (
	"errors"
	"fmt"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

func Install(mod *cmfx.Module) {
	if err := mod.DB().Create(&modelLinkage{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}

// Install 初始化数据
//
// item 表示根，ID 值不起作用
func (r *Root[T]) Install(item *Item[T]) error {
	if len(r.Items) > 0 { // 如果 r.Items 不为空，表示数据库有数据，则不能再次初始化。
		return errors.New("非空对象，不能再次安装数据。")
	}

	cnt, err := r.linkage.DB().
		Where("key=?", r.key).
		AndIsNull("deleted").
		Count(&modelLinkage{})
	if err != nil {
		return err
	}
	if cnt > 0 {
		return fmt.Errorf("已经存在同名的 key: %s", r.key)
	}

	tx, err := r.linkage.DB().Begin()
	if err != nil {
		return err
	}

	e := tx.NewEngine(r.linkage.DB().TablePrefix())
	if err := r.install(e, 0, item); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return r.Load()
}

func (r *Root[T]) install(engine orm.Engine, parent int64, item *Item[T]) error {
	data, err := marshal(item.Data)
	if err != nil {
		return err
	}
	mod := &modelLinkage{
		Key:    r.key,
		Data:   data,
		Parent: parent,
	}
	item.ID, err = engine.LastInsertID(mod)
	if err != nil {
		return err
	}

	for _, i := range item.Items {
		if err := r.install(engine, item.ID, i); err != nil {
			return err
		}
	}

	return nil
}
