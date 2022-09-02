// SPDX-License-Identifier: MIT

package token

import "time"

type blockedToken struct {
	Token   string    `orm:"name(token);len(-1);unique(token)"`
	Expired time.Time `orm:"name(expired)"`
}

func (d *blockedToken) TableName() string { return `_token_blocked_tokens` }

type discardUser struct {
	UserID  string    `orm:"name(user_id);unique(user_id)"`
	Expired time.Time `orm:"name(expired)"`
}

func (d *discardUser) TableName() string { return `_token_blocked_users` }
