// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Flatten, flatten, Flattenable, FlattenKeys } from '@/types';

/**
 * 翻译对象
 */
export type Dict = Flattenable<string>;

/**
 * 翻译对象所有字段的联合类型
 */
export type DictKeys<T extends Dict> = FlattenKeys<T>;

/**
 * 每个翻译对象扁平化的表示
 */
export type DictFlatten<T extends Dict> = Flatten<T, string>;

/**
 * 将翻译对象 dict 转换为一个扁平的对象
 */
export function dictFlatten<T extends Dict>(dict: T): DictFlatten<T> {
    return flatten<T, string>(dict);
}

/**
 * 加载翻译对象的方法
 */
export type Loader = { (): Promise<Dict> };
