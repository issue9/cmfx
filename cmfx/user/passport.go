// SPDX-FileCopyrightText: 2024-2025 caixw
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

	// Identity uid 在当前适配器中的唯一 ID
	//
	// identity 在当前适配中的唯一 ID；
	// state identity 与适配器的状态，可以有以下几种状态：
	//  - -1 该用户未与当前适配器适配，该状态下，identity 也为空值；
	//  - 0 identity 已与当前适配器完成匹配；
	//  - 其它正整数，由适配各种定义；
	Identity(uid int64) (identity string, state int8)

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
	XMLName struct{} `json:"-" cbor:"-" yaml:"-" toml:"-" xml:"passports"`
	ID      string   `json:"id" cbor:"id" xml:"id" yaml:"id" toml:"id" comment:"The ID of passport"`
	Desc    string   `json:"desc" cbor:"desc" xml:"desc" yaml:"desc" toml:"id" comment:"The description of passport"`
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

type IdentityVO struct {
	XMLName struct{} `json:"-" cbor:"-" yaml:"-" toml:"-" xml:"identity"`

	ID       string `json:"id" xml:"id" cbor:"id" yaml:"id" toml:"id" comment:"passport id"`
	Identity string `json:"identity" xml:"identity" cbor:"identity" yaml:"identity" toml:"identity" comment:"user identity for current passport"`
	State    int8   `json:"state" xml:"state,attr" cbor:"state" yaml:"state" toml:"state" comment:"the state for passport and identity"`
}

// Identities 获取 uid 已经关联的适配器
//
// 返回值键名为验证器 id，键值为该适配器对应的账号。
func (m *Module) Identities(uid int64) iter.Seq[*IdentityVO] {
	return func(yield func(id *IdentityVO) bool) {
		for _, p := range m.passports {
			identity, state := p.Identity(uid)
			if state >= 0 {
				vo := &IdentityVO{
					ID:       p.ID(),
					Identity: identity,
					State:    state,
				}
				if !yield(vo) {
					break
				}
			}
		}
	}
}
