// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package main

import (
	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/inital/cmd"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	if err := cmd.Exec("cmfx", cmfx.Version); err != nil {
		panic(err)
	}
}
