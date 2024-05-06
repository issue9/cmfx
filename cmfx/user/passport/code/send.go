// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"net/smtp"
	"strings"

	"github.com/issue9/errwrap"
)

// 验证码的占位符
const placeholder = "%%code%%"

// SendFunc 验证码发送方法
//
// target 为接收验证码的目标，比如邮箱地址或是手机号码等；
// code 为发送的验证码；
type SendFunc = func(target, code string) error

type SMTP struct {
	head     string // 固定的邮件头
	addr     string
	from     string
	subject  string
	template string
	auth     smtp.Auth
}

// NewSMTP 新建 [SMTP] 对象
//
// subject 为发送邮件的主题；
// addr 为 smtp 的主机地址，需要带上端口号；
// template 为邮件模板，可以有一个占位符 %%code%%；
func NewSMTP(subject, addr, from, template string, auth smtp.Auth) *SMTP {
	b := errwrap.Buffer{}
	b.Grow(1024)
	b.WString("From: ").WString(from).WString("\r\n").
		WString("Subject: ").WString(subject).WString("\r\n").
		WString("MIME-Version: ").WString("1.0\r\n").
		WString(`Content-Type: text/plain; charset="utf-8"`)

	if b.Err != nil {
		panic(b.Err)
	}

	ret := &SMTP{
		head:     b.String(),
		addr:     addr,
		from:     from,
		subject:  subject,
		template: template,
		auth:     auth,
	}
	return ret
}

// Send 发送邮件
func (s *SMTP) Send(email, code string) error {
	b := errwrap.Buffer{}
	b.Grow(1024)
	b.WString(s.head).
		WString("To: ").WString(email).WString("\r\n\r\n").
		WString(strings.Replace(s.template, placeholder, code, -1))

	if b.Err != nil {
		return b.Err
	}

	return smtp.SendMail(s.addr, s.auth, s.from, []string{email}, b.Bytes())
}
