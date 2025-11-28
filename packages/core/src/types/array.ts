// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 获取数组元素的类型
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;
