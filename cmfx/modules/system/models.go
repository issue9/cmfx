// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import "time"

type healthPO struct {
	Router       string        `orm:"name(router);len(20);unique(r_m_p)"`
	Method       string        `orm:"name(method);len(10);unique(r_m_p)"`
	Pattern      string        `orm:"name(pattern);len(500);unique(r_m_p)"`
	Min          time.Duration `orm:"name(min)"`
	Max          time.Duration `orm:"name(max)"`
	Count        int           `orm:"name(count)"`
	UserErrors   int           `orm:"name(user_errors)"`
	ServerErrors int           `orm:"name(server_errors)"`
	Last         time.Time     `orm:"name(last)"`
	Spend        time.Duration `orm:"name(spend)"`
}

func (l *healthPO) TableName() string { return `_api_healths` }

func (l *healthPO) BeforeUpdate() error {
	l.Last = time.Now()
	return nil
}
