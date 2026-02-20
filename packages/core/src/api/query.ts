// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 查询参数的单个字段的类型
 */
type QueryValue = string | number | boolean | null | undefined;

/**
 * 查询参数的类型
 */
export interface Query {
	[k: string]: QueryValue | Array<QueryValue>;
	page?: number;
	size?: number;
}

/**
 * 将 Q 转换为查询参数
 *
 * 如果存在 q.page 属性，会自动将 page 的值减去 1，因为后端的 api 是从 0 页开始的。
 */
export function query2Search<Q extends Query>(q: Q): string {
	if (q.page) {
		q = { ...q };
		q.page! -= 1;
	}

	const s = new URLSearchParams();
	Object.entries(q).forEach(v => {
		if (Array.isArray(v[1])) {
			s.append(v[0], v[1].join(','));
		} else {
			if (typeof v[1] === 'string') {
				s.append(v[0], v[1]);
			} else if (v[1] !== undefined) {
				s.append(v[0], v[1]!.toString());
			}
		}
	});

	const qs = s.toString();
	return qs ? `?${qs}` : '';
}
