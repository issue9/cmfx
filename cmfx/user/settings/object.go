// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package settings

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"go/token"
	"reflect"
	"slices"

	"github.com/issue9/conv"
	"github.com/issue9/orm/v6"
)

const tag = "setting"

// Object 设置对象的操作接口
//
// T 为实际的设置对象，必须得是一个结构体类型。其每一个公开字段在数据库中表示为一条记录。
// 如果要改变在数据库对应的字段名，可以为每一个字段添加 setting 标签，比如：
//
//	struct X {
//	    Field string `setting:"field"`
//	}
//
// 默认为字段名，如果不需要该字段，可以采用小写或是 setting:"-" 对其忽略。
//
// 用户对 T 的修改应该及时采用 [Object.Put] 写入数据源，否则在重启后这些修改不会生效。
type Object[T any] struct {
	id     string
	s      *Settings
	preset []*modelSetting // 保存着从数据库中加载的默认用户的设置对象
	users  map[int64]*T    // 缓存的对象
}

func checkObjectType[T any]() {
	if reflect.TypeFor[T]().Kind() != reflect.Struct {
		panic(fmt.Sprintf("T 的约束必须是结构体"))
	}
}

// NewObject 向 [Settings] 注册一个新的设置对象
//
// id 表示当前设置对象的 ID，每一个设置象需要有一个唯一的 id；
func NewObject[T any](s *Settings, id string) (*Object[T], error) {
	if slices.Index(s.objects, id) >= 0 {
		panic(fmt.Sprintf("已经存在相同的 ID：%s", id))
	}
	checkObjectType[T]()

	ss := make([]*modelSetting, 0, 10)
	size, err := s.db.Where("uid=?", s.presetUID).And("{group}=?", id).Select(true, &ss)
	if err != nil {
		return nil, err
	}
	if size == 0 { // 理论上不能出现这种情况
		panic(fmt.Sprintf("设置对象 %s 未安装", id))
	}

	s.objects = append(s.objects, id)

	return &Object[T]{
		s:      s,
		id:     id,
		preset: ss,
		users:  make(map[int64]*T, 100),
	}, nil
}

// Get 加载用户 uid 的配置项
//
// 按以下步骤返回：
//   - 查看是否有缓存的对象；
//   - 从数据库查找数据；
//   - 采用默认值；
func (obj Object[T]) Get(uid int64) (*T, error) {
	if o, found := obj.users[uid]; found {
		return o, nil
	}

	// 尝试从数据库加载数据

	var o T
	ss := make([]*modelSetting, 0, 10)
	size, err := obj.s.db.Where("uid=?", uid).And("{group}=?", obj.id).Select(true, &ss)
	if err != nil {
		return &o, err
	}

	if size == 0 {
		ss = obj.preset
	}

	if err = fromModels(ss, &o, obj.id); err != nil {
		return nil, err
	}
	obj.users[uid] = &o
	return &o, nil
}

// Set 保存 o 的设置对象
func (obj Object[T]) Set(uid int64, o *T) error {
	mods, err := toModels(o, uid, obj.id)
	if err != nil {
		return err
	}

	err = obj.s.db.DoTransaction(func(tx *orm.Tx) error {
		for _, mod := range mods {
			if _, err := tx.Update(mod, "value"); err != nil {
				return errors.Join(err, tx.Rollback())
			}
		}
		return nil
	})
	if err != nil {
		return err
	}

	obj.users[uid] = o
	return nil
}

// 将 o 转换为 []*modelSetting
func toModels[T any](o *T, uid int64, g string) ([]*modelSetting, error) {
	rv := reflect.ValueOf(o).Elem()
	size := rv.NumField()
	ss := make([]*modelSetting, 0, size)

	rt := rv.Type()
	for i := range size {
		key := getFieldName(rt.Field(i))
		if key == "" {
			continue
		}

		data, err := json.Marshal(rv.Field(i).Interface())
		if err != nil {
			return nil, err
		}
		ss = append(ss, &modelSetting{UID: sql.NullInt64{Int64: uid, Valid: true}, Group: g, Key: key, Value: string(data)})
	}

	return ss, nil
}

// 从 []modelSetting 转换为 o
func fromModels[T any](ss []*modelSetting, o *T, g string) error {
	rv := reflect.ValueOf(o).Elem()
	rt := rv.Type()

	for i := range rv.NumField() {
		key := getFieldName(rt.Field(i))
		if key == "" {
			continue
		}

		index := slices.IndexFunc(ss, func(s *modelSetting) bool { return s.Key == key && s.Group == g })
		if index < 0 {
			panic(fmt.Sprintf("不存在的字段:%s,%s", g, key))
		}

		if err := conv.Value(ss[index].Value, rv.Field(i)); err != nil {
			return err
		}
	}
	return nil
}

func getFieldName(f reflect.StructField) string {
	if !token.IsExported(f.Name) {
		return ""
	}

	if f.Tag == "" {
		return f.Name
	}

	switch key := f.Tag.Get(tag); key {
	case "":
		return f.Name
	case "-":
		return ""
	default:
		return key
	}
}
