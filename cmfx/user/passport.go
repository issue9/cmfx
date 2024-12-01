// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"cmp"
	"fmt"
	"iter"
	"slices"

	"github.com/issue9/web"
)

// Passport 身份验证的适配器
type Passport interface {
	// ID 该适配器对象的唯一标记
	ID() string

	// Description 对当前实例的描述信息
	Description() web.LocaleStringer

	// Identity uid 在当前适配器中的 ID 名称
	Identity(uid int64) (identity string)

	// Delete 解绑用户
	Delete(uid int64) error
}

func (m *Module) AddPassport(adp Passport) {
	if slices.IndexFunc(m.passports, func(a Passport) bool { return a.ID() == adp.ID() }) >= 0 {
		panic(fmt.Sprintf("已经存在同名 %s 的验证器", adp.ID()))
	}
	m.passports = append(m.passports, adp)
}

type passportVO struct {
	XMLName struct{} `json:"-" cbor:"-" yaml:"-" xml:"passports"`
	ID      string   `json:"id" cbor:"id" xml:"id" yaml:"id" comment:"The ID of passport"`
	Desc    string   `json:"desc" cbor:"desc" xml:"desc" yaml:"desc" comment:"The description of passport"`
}

func (m *Module) getPassports(ctx *web.Context) web.Responser {
	passports := make([]*passportVO, 0, len(m.passports))

	for _, a := range m.passports {
		passports = append(passports, &passportVO{
			ID:   a.ID(),
			Desc: a.Description().LocaleString(ctx.LocalePrinter()),
		})
	}
	slices.SortFunc(passports, func(a, b *passportVO) int { return cmp.Compare(a.ID, b.ID) })

	return web.OK(passports)
}

func (m *Module) getPassport(id string) Passport {
	if index := slices.IndexFunc(m.passports, func(a Passport) bool { return a.ID() == id }); index >= 0 {
		return m.passports[index]
	}
	return nil
}

// 清空与 uid 相关的所有登录信息
func (m *Module) deleteUser(uid int64) error {
	for _, p := range m.passports {
		if err := p.Delete(uid); err != nil {
			return err
		}
	}
	return nil
}

// Identities 获取 uid 已经关联的适配器
//
// 返回值键名为验证器 id，键值为该适配器对应的账号。
func (p *Module) Identities(uid int64) iter.Seq2[string, string] {
	return func(yield func(string, string) bool) {
		for _, info := range p.passports {
			if id := info.Identity(uid); id != "" {
				if !yield(info.ID(), id) {
					break
				}
			}
		}
	}
}
