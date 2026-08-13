// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type * as z from 'zod';

import type { Params } from '@core/api';
import type { Dict, DictLoader, Locale } from '@core/locale';
import { I18n } from '@core/locale';
import type { Flattenable, FlattenKeys, Primitive } from '@core/types';
import type { Validator, ValidResult } from './validation';

const objects = I18n.createObject<z.core.$ZodConfig>();

/**
 * 创建一个用于加载 zod 本地化语言的函数
 *
 * @param f - 加载 zod 本地化语言内容，比如 `(await import('../../node_modules/zod/v4/locales/en.js')).default`；
 * @returns 返回的是一个 {@link DictLoader} 函数，可在 {@link Locale.addDict} 中使用；
 */
export function createZodLocaleLoader(f: () => z.core.$ZodConfig): DictLoader {
	return async (locale: string): Promise<Dict | undefined> => {
		objects.set(locale, f());
		return undefined;
	};
}

/**
 * 将 {@link z.ZodObject | Zod} 对象包装为 {@link Validator} 方法
 *
 * @param s - zod schema；
 * @param l - Locale 对象；
 * @typeParam T - 被验证对象的类型；
 */
export function validator<T extends Flattenable | Primitive>(
	s: T extends Flattenable ? z.ZodObject : z.ZodType,
	l?: Locale,
): Validator<T> {
	let params: z.core.ParseContext<z.core.$ZodIssue>;
	if (l) {
		const obj = objects.get(l.locale.toString());
		if (obj) {
			params = { error: obj.localeError };
		}
	}

	return {
		changeLocale(id: Locale): void {
			params = { error: objects.get(id.locale.toString())!.localeError };
		},

		async valid(obj: unknown, path?: T extends Flattenable ? FlattenKeys<T> : undefined): Promise<ValidResult<T>> {
			if (path) {
				let schema = s; // 参数 s 会重复使用，所以需要一个新的变量来保存 path 对应的值。
				const items = (path as string).split('.');
				for (const item of items) {
					schema = (schema as z.ZodObject).shape[item];
				}

				const result = await schema.safeParseAsync(obj, params);
				if (result.success) {
					return [result.data as T, undefined];
				}

				const err = result.error.issues[0];
				return [
					undefined,
					[
						{
							name: joinPropertyKey(path, err.path) as T extends Flattenable ? FlattenKeys<T> : '',
							reason: err.message,
						},
					],
				];
			}

			const result = await s.safeParseAsync(obj, params);
			if (result.success) {
				return [result.data as T, undefined];
			}

			const errors: Params<T extends Flattenable ? FlattenKeys<T> : ''> = [];
			result.error.issues.forEach(i => {
				const p = joinPropertyKey('', i.path) as T extends Flattenable ? FlattenKeys<T> : '';
				errors.push({ name: p, reason: i.message });
			});
			return [undefined, errors];
		},
	};
}

function joinPropertyKey(p: string, keys: Array<PropertyKey>): string {
	for (const pp of keys) {
		switch (typeof pp) {
			case 'number':
				p += `[${pp}]`;
				break;
			case 'string':
				if (p) {
					p += `.${pp}`;
				} else {
					p = pp;
				}
		}
	}
	return p;
}
