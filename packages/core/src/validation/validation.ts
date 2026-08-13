// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Params } from '@core/api';
import type { Locale } from '@core/locale';
import type { Flattenable, FlattenKeys, Primitive } from '@core/types';

/**
 * 验证数据的返回结果
 *
 * @typeParam T - 需要验证的数据类型，可以是 Object，也可以是底层类型，如果是底层类型，那么 errors 中的字段名为空字符串；
 */
export type ValidResult<T extends Flattenable | Primitive> = [
	data: T | undefined,
	errors: Params<T extends Flattenable ? FlattenKeys<T> : ''> | undefined,
];

/**
 * 验证器
 *
 * @typeParam T - 需要验证的数据类型，可以是 Object 或是原始类型；
 */
export interface Validator<T extends Flattenable | Primitive> {
	/**
	 * 改变当前语言
	 *
	 * @remarks
	 * 该操作会改变之后对数据验证时的错误信息
	 */
	changeLocale(locale: Locale): void;

	/**
	 * 验证数据
	 *
	 * @param obj - 需要验证的数据；
	 * @param path - 如果不为空表示采用规则 path 验证 obj，如果是原始类型，则此参数无用；
	 */
	valid(obj: unknown, path?: T extends Flattenable ? FlattenKeys<T> : undefined): Promise<ValidResult<T>>;
}
