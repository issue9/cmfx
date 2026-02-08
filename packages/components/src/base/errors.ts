// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

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
