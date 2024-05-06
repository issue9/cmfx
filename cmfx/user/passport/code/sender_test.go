// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

var (
	_ Sender = &smtpSender{}
	_ Sender = &sender{}
)

type sender struct{}

func (s *sender) Send(_, _ string) error { return nil }

func (s *sender) ValidIdentity(id string) bool { return true }
