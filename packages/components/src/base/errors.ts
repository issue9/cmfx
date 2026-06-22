// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Problem } from '@cmfx/core';

/**
 * 表示组件的属性字段错误
 */
export class PropsError extends Error {
	readonly #prop: string;

	/**
	 * 初始化表示组件属性错误的对象
	 *
	 * @param prop - 组件属性名称；
	 * @param msg - 错误信息；
	 */
	constructor(prop: string, msg: string) {
		super(msg);
		super.name = 'PropsError';

		this.#prop = prop;
	}

	/**
	 * 获取错误的属性名称
	 */
	get prop(): string {
		return this.#prop;
	}
}

/**
 * 定义了对 {@link Problem} 的处理函数类型
 */
export type ProblemHandler<E = never> = (p?: Problem<E>) => Promise<void>;
