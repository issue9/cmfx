// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flattenable, FlattenKeys } from '@/types';

/**
 * 翻译对象
 */
export type Dict = Flattenable<string>;

/**
 * 翻译对象所有字段的联合类型
 */
export type DictKeys<T extends Dict> = FlattenKeys<T>;

/**
 * 加载翻译对象的方法
 *
 * @param locale - 当前语言环境；
 * @returns 翻译对象
 * 对于一些第三方库，可能并不需要返回其对象，而直接执行其对应的加载操作，
 * 那么可以返回一个 undefined。
 */
export type Loader = { (locale: string): Promise<Dict | undefined> };
