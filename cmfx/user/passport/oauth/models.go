// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package oauth

import "time"

type modelOAuth struct {
	ID       int64     `orm:"name(id);ai"`
	Created  time.Time `orm:"name(created)"`
	UID      int64     `orm:"name(uid);unique(uid)"`
	Identity string    `orm:"name(identity);len(32);unique(identity)"`
}

func (p *modelOAuth) TableName() string { return `` }
