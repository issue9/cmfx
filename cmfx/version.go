// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package cmfx

import (
	_ "embed"
	"strings"
)

//go:embed VERSION
var version string

func init() {
	version = strings.TrimSpace(version)
}

// Version 表示当前框架的版本
func Version() string { return version }
