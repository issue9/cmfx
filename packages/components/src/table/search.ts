// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Query } from '@cmfx/core';
import { SetParams, useSearchParams } from '@solidjs/router';

/**
 * 根据 T 生成其值类型为字符串的对象
 *
 * 该类型符合 {@link useSearchParams} 的类型参数。
 */
export type Params<T extends Query> = Record<keyof T, string>;

/**
 * 从地址的查询参数中获取值
 *
 * @typeParam Q - 查询参数的类型；
 * @param preset - 默认值，必须包含所有字段，哪怕是零值，否则与 searchParamsGetter 中的字段存在类型冲突时，无法处理；
 * @param searchParamsGetter - {@link useSearchParams} 返回值的第一个元素；
 * @returns 结合 preset 和从地址中获取的参数合并的参数对象
 */
export function fromSearch<Q extends Query>(
	preset: Q,
	searchParamsGetter: ReturnType<typeof useSearchParams<Params<Q>>>[0],
): Q {
	// 需要将 useSearchParams 返回的参数转换为 Q 类型，
	// 即将 {[x:string]:string} 转换为 Query

	for (const key in searchParamsGetter) {
		if (searchParamsGetter[key] && preset[key] !== searchParamsGetter[key]) {
			const pv = preset[key];
			const val = searchParamsGetter[key];

			if (Array.isArray(pv)) {
				switch (typeof pv[0]) {
					case 'string':
						preset[key] = val.split(',') as any;
						break;
					case 'number':
						preset[key] = val.split(',').map(v => {
							return parseInt(v, 10);
						}) as any;
						break;
					case 'boolean':
						preset[key] = val.split(',').map(v => {
							return v !== 'false';
						}) as any;
						break;
					default:
						preset[key] = val.split(',') as any;
				}
			} else {
				switch (typeof pv) {
					case 'string':
						preset[key] = val as any;
						break;
					case 'number':
						preset[key] = parseInt(val, 10) as any;
						break;
					case 'boolean':
						preset[key] = (val !== 'false') as any;
						break;
					default:
						preset[key] = val as any;
				}
			}
		}
	}

	return preset;
}

/**
 * 将查询参数写入地址中
 *
 * @typeParam Q - 查询参数的类型；
 * @param q - 查询参数；
 * @param searchSetter - {@link useSearchParams} 返回值的第二个元素；
 */
export function saveSearch<Q extends Query>(
	q: Q,
	searchSetter: ReturnType<typeof useSearchParams<Params<Q>>>[1],
): void {
	const s: SetParams = {};
	Object.entries(q).forEach(v => {
		if (Array.isArray(v[1])) {
			s[v[0]] = v[1].join(',');
		} else {
			s[v[0]] = v[1];
		}
	});
	searchSetter(s, { replace: true });
}
