// SPDX-License-Identifier: MIT

package token

import "github.com/issue9/middleware/v6/jwt"

var _ Claims = &defaultClaims{}

var _ jwt.BuildClaimsFunc[Claims] = BuildClaims
