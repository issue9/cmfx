// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 提取所有字段为可选类型的名称组成联合类型
 */
export type OptionalKeys<T> = NonNullable<{
    [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T]>;

/**
 * 排除 T 中所有的可选字段组成一个新的对象
 */
export type OmitOptional<T> = Omit<T, OptionalKeys<T>>;

/**
 * 提取 T 中所有的可选字段组成一个新的对象
 */
export type PickOptional<T> = Pick<T, OptionalKeys<T>>;
