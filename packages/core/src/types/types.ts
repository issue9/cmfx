// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 展开类型
 *
 * ```ts
 * type A = { a: string };
 * type B = { b: number };
 *
 * type AB = A & B; // TypeScript 类型提示：A & B（不会显示实际结构）
 * type ExpandedAB = Expand<A & B>; // TypeScript 类型提示：{ a: string; b: number }
 * ```
 *
 * NOTE: 该行为可能让编译时长变长，甚至可能因内在不足导致编译失败。
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
