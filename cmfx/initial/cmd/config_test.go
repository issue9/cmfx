// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmd

import "github.com/issue9/config"

var (
	_ config.Sanitizer = &Config{}
	_ config.Sanitizer = &Ratelimit{}
	_ config.Sanitizer = &DB{}
)
