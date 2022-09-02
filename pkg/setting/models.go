// SPDX-License-Identifier: MIT

package setting

type setting struct {
	Key   string `orm:"name(key);unique(group_key)"`
	Group string `orm:"name(group);len(20);unique(group_key)"`
	Value string `orm:"name(value);len(-1)"`
}

func (s *setting) TableName() string { return "_settings" }
