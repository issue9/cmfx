// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT


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
 * @typeParam T - 枚举值对应名称的翻译 ID，之所以不直接使用 string，是因为某些地方可能使用字符串联合类型更合适；
 */
export type Enum<K extends AvailableEnumType, T extends string = string> = [key: K, title: T];

/**
 * {@link Enum} 的集合
 *
 * @typeParam K - 枚举值的类型；
 * @typeParam T - 枚举值对应名称的翻译 ID；
 */
export type Enums<K extends AvailableEnumType, T extends string = string> = Array<Enum<K, T>>;
