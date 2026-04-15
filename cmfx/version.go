// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

package cmfx

import (
	_ "embed"
	"strings"

	"github.com/issue9/web"
)

//go:embed VERSION
var version string

func init() {
	version = strings.TrimSpace(version)
}

// Version 表示当前框架的版本
func Version() string { return web.GetAppVersion(version) }
