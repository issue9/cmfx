// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmd

import "github.com/issue9/config"

var (
	_ config.Sanitizer = &DB{}
	_ config.Sanitizer = &Config{}
)
