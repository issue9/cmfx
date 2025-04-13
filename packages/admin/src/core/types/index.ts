// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 判断两个范型是否相等
 *
 * https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
 */
export type Equal<X, Y> =
    (<T>() => (T extends X ? 1 : 2)) extends
    (<T>() => (T extends Y ? 1 : 2)) ? true : false;

/**
 * 联合类型转换为交叉类型
 */
export type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;

/**
 * 提取所有字段为可选类型的名称组成联合类型
 */
export type OptionalKeys<T> = NonNullable<{
    [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T]>;

/**
 * 排除 T 中所有的可选字段组成一个新的对象
 */
export type ExtractOptional<T> = Omit<T, OptionalKeys<T>>;

/**
 * 提取 T 中所有的可选字段组成一个新的对象
 */
export type PickOptional<T> = Pick<T, OptionalKeys<T>>;
