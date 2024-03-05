// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package email

import (
	"net/smtp"
	"strings"

	"github.com/issue9/errwrap"
)

// 验证码的占位符
const placeholder = "%%code%%"

type SMTP struct {
	addr     string
	from     string
	subject  string
	template string
	auth     smtp.Auth
}

// NewSMTP 新建 SMTP 对象
//
// subject 为发送邮件的主题；
// addr 为 smtp 的主机地址，需要带上端口号；
// template 为邮件模板，可以有一个占位符 %%code%%；
func NewSMTP(subject, addr, from, template string, auth smtp.Auth) *SMTP {
	ret := &SMTP{
		addr:     addr,
		from:     from,
		subject:  subject,
		template: template,
		auth:     auth,
	}
	return ret
}

// 初始化一些基本内容
//
// 像 To,From 这些内容都是固定的，可以先写入到缓存中，这样
// 这后就不需要再次构造这些内容。
func (s *SMTP) send(email, code string) error {
	b := errwrap.Buffer{}
	b.Grow(1024)

	// to
	b.WString("To: ").WString(email).WString("\r\n")

	// from
	b.WString("From: ").WString(s.from).WString("\r\n")

	// subject
	b.WString("Subject: ").WString(s.subject).WString("\r\n")

	// mime-version
	b.WString("MIME-Version: ").WString("1.0\r\n")

	// contentType
	b.WString(`Content-Type: text/plain; charset="utf-8"`).WString("\r\n\r\n")

	content := strings.Replace(s.template, placeholder, code, -1)
	b.WString(content)

	if b.Err != nil {
		return b.Err
	}

	return smtp.SendMail(s.addr, s.auth, s.from, []string{email}, b.Bytes())
}
