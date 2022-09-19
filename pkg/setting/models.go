// SPDX-License-Identifier: MIT

package setting

type modelSetting struct {
	Key   string `orm:"name(key);unique(group_key)"`
	Group string `orm:"name(group);len(20);unique(group_key)"`
	Value any    `orm:"name(value);len(-1)"`
}

func (s *modelSetting) TableName() string { return "_settings" }
