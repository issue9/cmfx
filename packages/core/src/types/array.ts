// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 判断两个数组是否相等
 */
export function arrayEqual<T>(a: Array<T>, b: Array<T>): boolean {
    if (a.length !== b.length) { return false; }
    return a.every((val, i) => val === b[i]);
}

/**
 * 获取数组元素的类型
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;
