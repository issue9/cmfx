// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Page, type Problem, type Query, query2Search, type REST } from '@cmfx/core';

/**
 * 生成一个由 REST 接口加载数据的函数
 */
export function buildRESTLoad<T extends object, Q extends Query>(
	rest: REST,
	path: string,
	onProblem?: <PE = never>(p?: Problem<PE>) => Promise<void>,
) {
	return async (q: Q): Promise<Page<T> | undefined> => {
		const ret = await rest.get(path + query2Search(q));
		if (!ret.ok) {
			if (ret.status !== 404 && onProblem) {
				await onProblem(ret.body);
			}
			return undefined;
		}
		return ret.body;
	};
}
