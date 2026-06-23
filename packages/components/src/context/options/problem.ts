// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { APIError, type Problem } from '@cmfx/core';

// 防止在 index.ts 中因为 Object.assgin 引起的循环引用
import { notify } from '@components/notify/notify/notify';

/**
 * 定义了对 {@link Problem} 的处理函数类型
 */
export type ProblemHandler<E = never> = (p?: Problem<E>) => Promise<void>;

export async function throwProblem<P = never>(p?: Problem<P>): Promise<void> {
	if (p) {
		throw APIError.fromProblem(p);
	}
}

/**
 * 将所有类型的 Problem 都以通知的形式通知用户
 */
export async function notifyProblem<P = never>(p?: Problem<P>): Promise<void> {
	if (p) {
		await notify(p.title, p.detail, 'error');
	}
}

/**
 * 框架默认对 {@link Problem} 的处理方式
 *
 * @typeParam E - {@link Problem} 的泛型参数 E；
 */
export async function handleProblem<P = never>(p?: Problem<P>): Promise<void> {
	if (p) {
		if (p.status >= 500) {
			await throwProblem(p);
		}
		await notifyProblem(p);
	}
}
