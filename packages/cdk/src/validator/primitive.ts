// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Primitive, Validator, ValidResult } from '@cmfx/core';

/**
 * 创建一个对底层类型的数据验证对象
 * @returns {@link Validator} 验证对象
 * @param f - 验证方法；
 * @param loc - 本地化的语言 ID；
 */
export function createPrimitiveValidator<T extends Primitive>(
	f: (v: T, loc: string) => Promise<string | undefined>,
	loc: string,
): Validator<T> {
	return {
		changeLocale(l: string) {
			loc = l;
		},

		async valid(obj: unknown): Promise<ValidResult<T>> {
			const msg = await f(obj as T, loc);

			// biome-ignore lint/suspicious/noExplicitAny: any
			return msg ? [undefined, [{ name: '' as any, reason: msg }]] : [obj as T, undefined];
		},
	};
}
