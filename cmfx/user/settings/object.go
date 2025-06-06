// SPDX-FileCopyrightText: 2024-2025 caixw
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
	"strconv"
	"time"

	"github.com/issue9/cache"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

const tag = "setting"

type Sanitizer interface {
	SanitizeSettings() error
}

// Object 设置对象的操作接口
//
// T 为实际的设置对象，必须得是一个结构体类型。
// 如果 T 的指针还实现了 [Sanitizer] 接口，那么在加载或是写入数据源成功之后会调用该接口对数据进行修正。
// 用户对 T 的修改应该及时采用 [Object.Put] 写入数据源，否则在重启后这些修改不会生效。
//
// 其每一个公开字段在数据库中表示为一条记录。如果要改变在数据库对应的字段名，
// 可以为每一个字段添加 setting 标签，比如：
//
//	struct X {
//	    Field string `setting:"field"`
//	}
//
// 默认为字段名，如果不需要该字段，可以采用小写或是 setting:"-" 对其忽略。
// 如果字段是非内置的类型，可以实现 json 的相关接口实现自定义的存储和读取功能。
type Object[T any] struct {
	id     string
	s      *Settings
	preset []*settingPO // 保存着从数据库中加载的默认用户的设置对象
	ttl    time.Duration
}

func checkObjectType[T any]() {
	if reflect.TypeFor[T]().Kind() != reflect.Struct {
		panic("T 的约束必须是结构体")
	}
}

// LoadObject 从 [Settings] 加载设置对象的数据
//
// id 表示当前设置对象的 ID，每一个设置象需要有一个唯一的 id；
func LoadObject[T any](s *Settings, id string, ttl time.Duration) (*Object[T], error) {
	if slices.Index(s.objects, id) >= 0 {
		panic(fmt.Sprintf("已经存在相同的 ID：%s", id))
	}
	checkObjectType[T]()

	ss := make([]*settingPO, 0, 10)
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
		ttl:    ttl,
	}, nil
}

// Get 加载用户 uid 的配置项
//
// 按以下步骤返回：
//   - 查看是否有缓存的对象；
//   - 从数据库查找数据；
//   - 采用默认值；
func (obj *Object[T]) Get(uid int64) (*T, error) {
	var o T
	err := cache.GetOrInit[T](obj.s.c, strconv.FormatInt(uid, 10), &o, obj.ttl, func(o *T) error {
		ss := make([]*settingPO, 0, 10)
		size, err := obj.s.db.Where("uid=?", uid).And("{group}=?", obj.id).Select(true, &ss)
		if err != nil {
			return err
		}

		if uid == obj.s.presetUID {
			obj.preset = ss
		} else if size == 0 {
			ss = obj.preset
		}

		if err = obj.fromModels(ss, o); err != nil {
			return err
		}
		return nil
	})

	return &o, err
}

// Set 保存 o 的设置对象
func (obj *Object[T]) Set(uid int64, o *T) error {
	mods, err := toModels(o, uid, obj.id)
	if err != nil {
		return err
	}

	if uid == obj.s.presetUID {
		obj.preset = mods
	}

	if err := obj.s.c.Set(strconv.FormatInt(uid, 10), *o, obj.ttl); err != nil {
		return err
	}

	err = obj.s.db.DoTransaction(func(tx *orm.Tx) error {
		for _, mod := range mods {
			if _, _, err := tx.Save(mod, "value"); err != nil {
				return errors.Join(err, tx.Rollback())
			}
		}
		return nil
	})
	if err != nil {
		return err
	}

	return nil
}

// HandleGet 用于处理 Get 的 HTTP 请求
func (obj *Object[T]) HandleGet(ctx *web.Context, uid int64) web.Responser {
	data, err := obj.Get(uid)
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(data)
}

// HandlePut 用于处理 Put 的 HTTP 请求
func (obj *Object[T]) HandlePut(ctx *web.Context, uid int64) web.Responser {
	var data T
	if resp := ctx.Read(true, &data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := obj.Set(uid, &data); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

// 将 o 转换为 []*modelSetting
func toModels[T any](o *T, uid int64, g string) ([]*settingPO, error) {
	rv := reflect.ValueOf(o).Elem()
	size := rv.NumField()
	ss := make([]*settingPO, 0, size)

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
		ss = append(ss, &settingPO{UID: sql.NullInt64{Valid: true, Int64: uid}, Group: g, Key: key, Value: string(data)})
	}

	if err := callSanitizer(o); err != nil {
		return nil, err
	}
	return ss, nil
}

// 从 []modelSetting 转换为 o
func (obj *Object[T]) fromModels(ss []*settingPO, o *T) error {
	rv := reflect.ValueOf(o).Elem()
	rt := rv.Type()

	for i := range rv.NumField() {
		key := getFieldName(rt.Field(i))
		if key == "" {
			continue
		}

		index := slices.IndexFunc(ss, func(s *settingPO) bool { return s.Key == key && s.Group == obj.id })
		if index < 0 {
			panic(fmt.Sprintf("不存在的字段:%s,%s", obj.id, key))
		}

		if err := json.Unmarshal([]byte(ss[index].Value), rv.Field(i).Addr().Interface()); err != nil {
			return err
		}
	}

	return callSanitizer(o)
}

func callSanitizer(o any) error {
	if s, ok := o.(Sanitizer); ok {
		return s.SanitizeSettings()
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
