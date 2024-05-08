// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package settings

import (
	"database/sql"
	"time"
)

type modelSetting struct {
	ID      int64         `orm:"name(id);ai"`
	Group   string        `orm:"name(group);len(20);unique(group_key_uid)"`
	Key     string        `orm:"name(key);len(20);unique(group_key_uid)"`
	UID     sql.NullInt64 `orm:"name(uid);unique(group_key_uid)"` // 0 是有效果的 UID
	Value   string        `orm:"name(value)"`
	Created time.Time     `orm:"name(time)"`
}

func (l *modelSetting) BeforeInsert() error {
	if l.Created.IsZero() {
		l.Created = time.Now()
	}
	return nil
}

func (l *modelSetting) TableName() string { return `` }
