// SPDX-License-Identifier: MIT

package store

type modelSetting struct {
	ID    string `orm:"name(id);len(20);unique(id)"`
	Value string `orm:"name(value);len(-1)"`
}

func (s *modelSetting) TableName() string { return "_settings" }
