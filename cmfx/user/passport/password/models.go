// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package password

import "time"

type modelPassword struct {
	ID      int64     `orm:"name(id);ai"`
	Created time.Time `orm:"name(created)"`
	Updated time.Time `orm:"name(updated)"`

	UID      int64  `orm:"name(uid);unique(uid)"`
	Identity string `orm:"name(identity);len(32);unique(identity)"`
	Password []byte `orm:"name(password);len(64)"`
}

func (p *modelPassword) TableName() string { return `_auth_passwords` }

func (p *modelPassword) BeforeUpdate() error {
	p.Updated = time.Now()
	return nil
}
