// SPDX-License-Identifier: MIT

package cmfx

//go:generate web locale -l=und -m -f=yaml ./
//go:generate web update-locale -src=./locales/und.yaml -dest=./locales/zh-Hans.yaml

//go:generate web doc -d ./
