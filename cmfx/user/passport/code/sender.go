// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"net/smtp"
	"strings"

	"github.com/issue9/errwrap"
	"github.com/issue9/mux/v8/header"
	"github.com/issue9/webfilter/validator"
)

// Sender 验证码的发送者需要实现的接口
type Sender interface {
	// ValidIdentity 验证接收地址的格式是否正确
	ValidIdentity(string) bool

	// Sent 发送验证码
	//
	// target 为接收验证码的目标，比如邮箱地址或是手机号码等；
	// code 为发送的验证码；
	Sent(target, code string) error
}

// 验证码的占位符
const placeholder = "%%code%%"

type smtpSender struct {
	head     string // 固定的邮件头
	addr     string
	from     string
	subject  string
	template string
	auth     smtp.Auth
}

type emptySender struct{}

// NewEmptySender 一个空的 [Sender] 实现
func NewEmptySender() Sender { return &emptySender{} }

func (s *emptySender) ValidIdentity(_ string) bool { return true }

func (s *emptySender) Sent(_, _ string) error { return nil }

// NewSMTPSender 基于 SMTP 的 [Sender] 实现
//
// subject 为发送邮件的主题；
// addr 为 smtp 的主机地址，需要带上端口号；
// template 为邮件模板，可以有一个占位符 %%code%%；
func NewSMTPSender(subject, addr, from, template string, auth smtp.Auth) Sender {
	b := errwrap.Buffer{}
	b.Grow(1024)
	b.WString(header.From).WByte(' ').WString(from).WString("\r\n").
		WString("Subject: ").WString(subject).WString("\r\n").
		WString("MIME-Version: ").WString("1.0\r\n").
		WString(`Content-Type: text/plain; charset="utf-8"`)

	if b.Err != nil {
		panic(b.Err)
	}

	ret := &smtpSender{
		head:     b.String(),
		addr:     addr,
		from:     from,
		subject:  subject,
		template: template,
		auth:     auth,
	}
	return ret
}

func (s *smtpSender) ValidIdentity(identity string) bool { return validator.Email(identity) }

// Sent 发送邮件
func (s *smtpSender) Sent(email, code string) error {
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
