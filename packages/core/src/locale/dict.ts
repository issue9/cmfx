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
 */
export type Loader = { (): Promise<Dict> };
