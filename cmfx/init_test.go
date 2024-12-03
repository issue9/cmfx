// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package cmfx

import (
	"github.com/issue9/config"
	"github.com/issue9/web"
)

var _ config.Sanitizer = &Ratelimit{}

var _ web.PluginFunc = problems
