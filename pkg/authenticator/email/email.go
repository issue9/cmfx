// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package email 邮件验证
package email

import (
	"database/sql"
	"time"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/db"
)

type Email struct {
	mod  cmfx.Module
	smtp *SMTP

	expired time.Duration
}

func New(mod cmfx.Module, expired time.Duration, smtp *SMTP) *Email {
	return &Email{
		mod:  mod,
		smtp: smtp,

		expired: expired,
	}
}

// Send 发送验证码
func (e *Email) Send(tx *db.Tx, email, code string) error {
	if err := e.smtp.send(email, code); err != nil {
		return err
	}

	p := e.mod.DBEngine(tx)

	mod := &modelEmail{Email: email}
	found, err := p.Select(mod)
	if err != nil {
		return err
	}

	if !found {
		_, err = p.Insert(&modelEmail{
			Email:   email,
			Code:    code,
			Expired: time.Now().Add(e.expired),
		})
		return err
	}

	_, err = p.Update(&modelEmail{
		Email:    email,
		Code:     code,
		Expired:  time.Now().Add(e.expired),
		Verified: sql.NullTime{},
		Deleted:  false,
	}, "deleted")
	return err
}

func (e *Email) Delete(tx *db.Tx, uid int64) error {
	_, err := e.mod.DBEngine(nil).Delete(&modelEmail{UID: uid})
	return err
}

// Invalid 使指定的验证码无效
func (e *Email) Invalid(tx *db.Tx, email, code string) error {
	mod := &modelEmail{
		Email:    email,
		Verified: sql.NullTime{Time: time.Now(), Valid: true},
		Deleted:  true,
	}
	_, err := e.mod.DBEngine(tx).Update(mod)
	return err
}

func (e *Email) Valid(email, code string) (int64, string, bool) {
	mod := &modelEmail{Email: email}
	found, err := e.mod.DBEngine(nil).Select(mod)
	if err != nil {
		e.mod.Server().Logs().ERROR().Error(err)
		return 0, "", false
	}

	if !found || mod.Code != code {
		return 0, "", false
	}

	if mod.UID == 0 {
		return 0, email, false
	}
	return mod.UID, "", true
}

func (e *Email) Identity(uid int64) (string, bool) {
	mod := &modelEmail{UID: uid}
	found, err := e.mod.DBEngine(nil).Select(mod)
	if err != nil {
		e.mod.Server().Logs().ERROR().Error(err)
		return "", false
	}
	return mod.Email, found
}
