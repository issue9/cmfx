// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package totp

import "time"

type modelTOTP struct {
	ID      int64     `orm:"name(id);ai"`
	Created time.Time `orm:"name(created)"`
	Updated time.Time `orm:"name(updated)"`

	UID      int64  `orm:"name(uid);default(0)"`
	Identity string `orm:"name(identity);len(32);unique(identity)"`
	Secret   []byte `orm:"name(secret);len(160)"`
}

func (p *modelTOTP) TableName() string { return `` }
