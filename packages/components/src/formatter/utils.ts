// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

export function buildPerUnit<T extends string>(prefix: T, per?: string): string {
	return per ? `${prefix}-per-${per}` : prefix;
}
