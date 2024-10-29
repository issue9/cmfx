// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"github.com/issue9/rands/v3"
	"github.com/issue9/web"
)

type Generator = func() string

func NumberGenerator(s web.Server, name string) Generator {
	srv := rands.New(nil, 100, 4, 5, rands.Number())
	s.Services().Add(web.Phrase("generator code for %s", name), srv)

	return func() string {
		return srv.String()
	}
}

// TODO
