// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Locale } from '@/context';

/**
 * 枚举类型
 *
 *  - 0 为枚举值；
 *  - 1 为枚举值对应名称的翻译项；
 */
export type Enum<T extends string | number> = [T, string];

/**
 * {@link Enum} 的集合
 */
export type Enums<T extends string | number> = Array<Enum<T>>;

/**
 * 从 enums 中查找 item 对应的名称
 *
 * @param enums 表示枚举集合；
 * @param l 本地化对象；
 * @param item 需要被翻译的枚举值；
 */
export function translateEnum<T extends string|number>(enums: Enums<T>, l: Locale, item: T): string|undefined {
    const val = enums.find((v) => v[0] === item);
    return val ? (l.t(val[1]) as string ?? val[1]) : undefined;
}

