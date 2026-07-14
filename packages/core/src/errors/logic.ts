// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 逻辑错误
 *
 * @remarks
 * 业务逻辑错误，比如参数错误、数据错误等。
 */
export class LogicError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'LogicError';
	}
}

/**
 * 无法找到上下文环境
 */
export class ContextNotFoundError extends LogicError {
	#ctx: string;

	constructor(name: string) {
		super(`无法找到上下文环境：${name}`);
		this.#ctx = name;
		this.name = 'ContextNotFoundError';
	}

	get context(): string {
		return this.#ctx;
	}
}

/**
 * 表示组件的属性字段错误
 */
export class PropsError extends LogicError {
	readonly #prop: string;

	/**
	 * 初始化表示组件属性错误的对象
	 *
	 * @param prop - 组件属性名称；
	 * @param msg - 错误信息；
	 */
	constructor(prop: string, msg: string) {
		super(`属性错误：${prop} - ${msg}`);
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
