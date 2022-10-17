// SPDX-License-Identifier: MIT

// Package email 邮件验证
package email

import (
	"database/sql"
	"time"

	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
)

type Email struct {
	s        *web.Server
	dbPrefix orm.Prefix
	db       *orm.DB
	smtp     *SMTP

	expired time.Duration
}

func New(s *web.Server, prefix orm.Prefix, db *orm.DB, expired time.Duration, smtp *SMTP) *Email {
	return &Email{
		s:        s,
		dbPrefix: prefix,
		db:       db,
		smtp:     smtp,

		expired: expired,
	}
}

// Send 发送验证码
func (e *Email) Send(tx *orm.Tx, email, code string) error {
	if err := e.smtp.send(email, code); err != nil {
		return err
	}

	p := e.modelEngine(tx)

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

func (e *Email) Delete(tx *orm.Tx, uid int64) error {
	_, err := e.modelEngine(nil).Delete(&modelEmail{UID: uid})
	return err
}

// Invalid 使指定的验证码无效
func (e *Email) Invalid(tx *orm.Tx, email, code string) error {
	mod := &modelEmail{
		Email:    email,
		Verified: sql.NullTime{Time: time.Now(), Valid: true},
		Deleted:  true,
	}
	_, err := e.modelEngine(tx).Update(mod)
	return err
}

func (e *Email) Valid(email, code string) (int64, string, bool) {
	mod := &modelEmail{Email: email}
	found, err := e.modelEngine(nil).Select(mod)
	if err != nil {
		e.s.Logs().ERROR().Error(err)
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
	found, err := e.modelEngine(nil).Select(mod)
	if err != nil {
		e.s.Logs().ERROR().Error(err)
		return "", false
	}
	return mod.Email, found
}

func (e *Email) modelEngine(tx *orm.Tx) orm.ModelEngine {
	if tx == nil {
		return e.dbPrefix.DB(e.db)
	} else {
		return e.dbPrefix.Tx(tx)
	}
}
