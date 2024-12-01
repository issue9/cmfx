// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package codetest 为 code 提供测试内容
package codetest

type EmptySender struct {
	Target string
	Code   string
}

// New 声明用于测试的 Sender
func New() *EmptySender { return &EmptySender{} }

func (s *EmptySender) ValidIdentity(_ string) bool { return true }

func (s *EmptySender) Sent(target, code string) error {
	s.Target = target
	s.Code = code
	return nil
}
