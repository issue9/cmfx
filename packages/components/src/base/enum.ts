// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale } from './locale';

/**
 * 定义了可用于使用的枚举值类型，要求唯一且可比较。
 */
export type AvailableEnumType = string | number;

/**
 * 枚举类型
 *
 *  - 0 为枚举值；
 *  - 1 为枚举值对应名称的翻译项；
 *
 * @template K 枚举值的类型；
 * @template T 枚举值对应名称的翻译 ID；
 */
export type Enum<K extends AvailableEnumType, T extends string = string> = [key: K, title: T];

/**
 * {@link Enum} 的集合
 *
 * @template K 枚举值的类型；
 * @template T 枚举值对应名称的翻译 ID；
 */
export type Enums<K extends AvailableEnumType, T extends string = string> = Array<Enum<K, T>>;

/**
 * 从 enums 中查找 item 对应的名称
 *
 * @param enums 表示枚举集合；
 * @param l 本地化对象；
 * @param item 需要被翻译的枚举值；
 * @template K 枚举值的类型；
 * @template T 枚举值对应名称的翻译 ID；
 */
export function translateEnum<K extends AvailableEnumType, T extends string = string>(enums: Enums<K,T>, l: Locale, item: K): string | undefined {
    const val = enums.find((v) => v[0] === item);
    return val ? (l.t(val[1]) ?? val[1]) : undefined;
}

/**
 * 将一个枚举对象 enums 翻译成符合 l 要求的本地化对象
 *
 * @template K 枚举值的类型；
 * @template T 枚举值对应名称的翻译 ID；
 */
export function translateEnums<K extends AvailableEnumType, T extends string = string>(enums: Enums<K,T>, l: Locale): Enums<K, string> {
    return enums.map(v => [v[0], l.t(v[1])]);
}
