// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"github.com/issue9/rands/v3"
	"github.com/issue9/web"
)

// Generator 生成验证码的方法签名
type Generator = func() string

// NumberGenerator 生成长度为 length 的数字验证码
func NumberGenerator(s web.Server, name string, length int) Generator {
	srv := rands.New(nil, 100, length, length+1, rands.Number())
	s.Services().Add(web.Phrase("generator code for %s", name), srv)

	return func() string { return srv.String() }
}

// AlphaNumberGenerator 生成长度为 length 的验证码
func AlphaNumberGenerator(s web.Server, name string, length int) Generator {
	srv := rands.New(nil, 100, length, length+1, rands.AlphaNumber())
	s.Services().Add(web.Phrase("generator code for %s", name), srv)

	return func() string { return srv.String() }
}
