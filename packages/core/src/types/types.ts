// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 展开类型
 *
 * 支持以下几种方式：
 *
 * 1. 联合类型：
 * ```ts
 * type A = { a: string };
 * type B = { b: number };
 * type AB = A & B; // TypeScript 类型提示：A & B（不会显示实际结构）
 * type ExpandedAB = Expand<A & B>; // TypeScript 类型提示：{ a: string; b: number }
 * ```
 *
 * 2. extends
 * ```ts
 * interface C extends A {
 *     c: number;
 * }
 * type ExpandedC = Expand<C>; // TypeScript 类型提示：{ a: string; c: number }
 * ```
 *
 * 3. 引用
 * ```ts
 * interface D {
 *     d: number;
 *     a: A;
 * }
 * type ExpandedD = Expand<D>; // TypeScript 类型提示：{ d: number; a: { a: string } }
 * ```
 *
 * BUG: 无法处理泛型的展开，比如 `func<T extends A = A>` 中，对于 T 虽然指定了约束条件 A，
 * 但是还是无法作为 T 的一部分提前展开，以供函数中使用。
 *
 * NOTE: 该行为可能让编译时长变长，甚至可能因内在不足导致编译失败。
 */
export type Expand<T> = T extends object
    ? T extends Function
        ? T
        : { [K in keyof T]: Expand<T[K]> }
    : T;

// 以下代码无法对子元素进行展开
//export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * 移除 interface 声明中的索引签名，展示真实的结构
 *
 * ```ts
 * interface Example {
 *   [key: string]: any;
 *   foo: string;
 *   bar: number;
 * }
 * RemoveIndexSignature<Example> // { foo: string; bar: number; }
 * ```
 */
export type RemoveIndexSignature<T> = {
    [K in keyof T as string extends K
        ? never
        : number extends K
            ? never
            : symbol extends K
                ? never
                : K]: T[K];
};

type RequiredKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? never : K }[keyof T];

type PartialKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T];

/**
 * 将类型 T 的可选字段变为必选，必选字段变为可选。
 */
export type SwapPartialRequired<T> = Partial<Pick<T, RequiredKeys<T>>> & Required<Pick<T, PartialKeys<T>>>;
