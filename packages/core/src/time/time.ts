// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 延时
 *
 * @param ms 时间，以毫秒为单位
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
