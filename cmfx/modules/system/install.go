// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"database/sql"
	"encoding/json"
	"errors"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

func Install(mod *cmfx.Module) {
	if err := mod.DB().Create(&modelHealth{}, &modelLinkage{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}

// DeleteLinkage 删除指定的级联数据
func DeleteLinkage(l *Loader, key string) error {
	mod := &modelLinkage{Deleted: sql.NullTime{Valid: true, Time: time.Now()}}
	_, err := l.mod.DB().Where("key=?", key).Update(mod)
	return err
}

// InstallLinkage 安装一组级联数据
func InstallLinkage[T any](l *Loader, key, title string, items []*LinkageItem[T]) error {
	// TODO 限制 T 的类型能为指针？

	db := l.mod.DB()
	root := &modelLinkage{}

	size, err := db.Where("key=?", key).AndIsNull("deleted").Select(true, root)
	if err != nil {
		return err
	}
	if size > 0 {
		panic("已经存在同名的级联数据")
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	id, err := tx.LastInsertID(&modelLinkage{Key: key, Title: title})
	if err != nil {
		return errors.Join(err, tx.Rollback())
	}

	for _, item := range items {
		err = installLinkage[T](tx, key, id, item)
		if err != nil {
			return errors.Join(err, tx.Rollback())
		}
	}

	return tx.Commit()
}

func installLinkage[T any](tx *orm.Tx, key string, parent int64, item *LinkageItem[T]) error {
	data, err := json.Marshal(item.Data)
	if err != nil {
		return err
	}

	last, err := tx.LastInsertID(&modelLinkage{
		Key:    key,
		Data:   data,
		Parent: parent,
	})
	if err != nil {
		return err
	}

	for _, item := range item.Items {
		if err := installLinkage(tx, key, last, item); err != nil {
			return err
		}
	}

	return nil
}
