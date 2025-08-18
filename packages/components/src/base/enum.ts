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
 * @typeParam K - 枚举值的类型；
 * @typeParam T - 枚举值对应名称的翻译 ID；
 */
export type Enum<K extends AvailableEnumType, T extends string = string> = [key: K, title: T];

/**
 * {@link Enum} 的集合
 *
 * @typeParam K - 枚举值的类型；
 * @typeParam T - 枚举值对应名称的翻译 ID；
 */
export type Enums<K extends AvailableEnumType, T extends string = string> = Array<Enum<K, T>>;

/**
 * 将一个枚举对象 enums 翻译成符合 l 要求的本地化对象
 *
 * @param enums - 表示枚举集合；
 * @param l - 本地化对象；
 * @typeParam K - 枚举值的类型；
 * @typeParam T - 枚举值对应名称的翻译 ID；
 */
export function translateEnums<K extends AvailableEnumType, T extends string = string>(enums: Enums<K,T>, l: Locale): Enums<K, string> {
    return enums.map(v => [v[0], l.t(v[1])]);
}
