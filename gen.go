// SPDX-License-Identifier: MIT

package cmfx

//go:generate web locale -l=en-US -m -f=yaml ./
//go:generate web update-locale -src=./locales/en-US.yaml -dest=./locales/zh-Hans.yaml

//go:generate web doc -d ./
