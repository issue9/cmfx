// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

var _ SendFunc = (&SMTP{}).Send

func send(_, _ string) error { return nil }
