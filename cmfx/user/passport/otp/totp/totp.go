// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package hotp 提供基于 [TOTP] 的 [passport.Adapter] 实现
//
// [TOTP]: https://datatracker.ietf.org/doc/html/rfc6238
package totp

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/binary"
	"math"
	"strconv"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport"
	"github.com/issue9/cmfx/cmfx/user/passport/utils"
)

type totp struct {
	mod  *cmfx.Module
	db   *orm.DB
	id   string
	desc web.LocaleStringer
}

// New 声明基于 [TOTP] 的 [passport.Adapter] 实现
//
// [TOTP]: https://datatracker.ietf.org/doc/html/rfc6238
func New(mod *cmfx.Module, id string, desc web.LocaleStringer) passport.Adapter {
	db := utils.BuildDB(mod, id)
	return &totp{
		mod:  mod,
		db:   db,
		id:   id,
		desc: desc,
	}
}

func (p *totp) ID() string { return p.id }

func (p *totp) Description() web.LocaleStringer { return p.desc }

// Add 添加账号
//
// identity 表示账号，在登录页上，需要通过账号来判定验证码的关联对象。
func (p *totp) Add(uid int64, identity, _ string, now time.Time) error {
	n, err := p.db.Where("uid=?", uid).Count(&modelTOTP{})
	if err != nil {
		return err
	}
	if uid > 0 && n > 0 {
		return passport.ErrUIDExists()
	}

	mod := &modelTOTP{Identity: identity}
	found, err := p.db.Select(mod)
	if err != nil {
		return err
	}

	secret := []byte(p.mod.Server().UniqueID())

	if found {
		if mod.UID > 0 { // 存在同一个值的
			return passport.ErrIdentityExists()
		}

		// NOTE: 存在 uid == 0 的临时验证数据
		_, err = p.db.Update(&modelTOTP{
			Updated:  now,
			UID:      uid,
			Identity: identity,
			Secret:   secret,
		})
	} else {
		_, err = p.db.Insert(&modelTOTP{
			Created:  now,
			Updated:  now,
			UID:      uid,
			Identity: identity,
			Secret:   secret,
		})
	}

	return err
}

func (p *totp) Delete(uid int64) error {
	_, err := p.db.Where("uid=?", uid).Delete(&modelTOTP{})
	return err
}

func (p *totp) Update(uid int64) error { return nil }

func (p *totp) Valid(username, pass string, now time.Time) (int64, string, error) {
	mod := &modelTOTP{Identity: username}
	found, err := p.db.Select(mod)
	if err != nil {
		return 0, "", err
	}
	if !found {
		return 0, "", passport.ErrUnauthorized()
	}

	// 将时间戳转换为字节数组
	msg := make([]byte, 8)
	binary.BigEndian.PutUint64(msg, uint64(now.Unix()/30))
	h := hmac.New(sha1.New, mod.Secret)
	h.Write(msg)
	hmacHash := h.Sum(nil)

	// 获取偏移量
	offset := hmacHash[len(hmacHash)-1] & 0xf
	binaryCode := ((int32(hmacHash[offset]) & 0x7f) << 24) |
		((int32(hmacHash[offset+1] & 0xff)) << 16) |
		((int32(hmacHash[offset+2] & 0xff)) << 8) |
		(int32(hmacHash[offset+3]) & 0xff)

	const digitLen = 6

	otp := int(binaryCode) % int(math.Pow10(digitLen))
	result := strconv.Itoa(otp)
	for len(result) < digitLen { // 补齐前导的 0
		result = "0" + result
	}

	if result == pass {
		return mod.UID, mod.Identity, nil
	}
	return 0, "", passport.ErrUnauthorized()
}

func (p *totp) Identity(uid int64) (string, error) {
	mod := &modelTOTP{}
	size, err := p.db.Where("uid=?", uid).Select(true, mod)
	if err != nil {
		return "", err
	}
	if size == 0 {
		return "", passport.ErrUIDNotExists()
	}

	return mod.Identity, nil
}

func (p *totp) UID(identity string) (int64, error) {
	mod := &modelTOTP{}
	size, err := p.db.Where("identity=?", identity).Select(true, mod)
	if err != nil {
		return 0, err
	}
	if size == 0 {
		return 0, passport.ErrIdentityNotExists()
	}

	return mod.UID, nil
}
