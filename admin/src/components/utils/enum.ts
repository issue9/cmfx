// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { AppContext } from '@/app';
import { Options } from '@/components';

export type Enum<T extends string|number> = [T, string];

/**
 * 枚举类型的以其对应的翻译 ID 的集合
 */
export type Enums<T extends string|number> = Array<Enum<T>>;

/**
 * 将枚举类型 item 翻译成 ctx 的当前语言
 *
 * @param enums 表示所有的枚举集合；
 */
export function translateEnum<T extends string|number>(enums: Enums<T>, ctx: AppContext, item?: T): string|undefined {
    const val = enums.find((v) => v[0] === item)!;
    return ctx.locale().t(val[1]) as string;
}

/**
 * 将枚举值转换成 Options<T> 类型
 */
export function buildEnumsOptions<T extends string|number>(e: Enums<T>, ctx: AppContext): Options<T> {
    return e.map((v) => [v[0], ctx.locale().t(v[1]) as string]);
}
