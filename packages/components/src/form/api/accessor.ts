// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 定义了对对象中某个字段的存取接口
 */
export interface FieldAccessor<T> {
	name(): string;

	/**
	 * 获取当前元素的错误信息，如果没有错误则返回 undefined
	 *
	 * @returns 返回的是由 {@link createStore} 创建的对象属性，是一个可响应的属性。
	 */
	getError(): string | undefined;

	/**
	 * 修改当前元素的错误信息
	 *
	 * @param err - 如果为 undefined，则表示清空错误信息。
	 */
	setError(err?: string): void;

	/**
	 * 区别当前元素关联的值
	 *
	 * @returns 返回的是由 {@link createStore} 创建的对象属性，是一个可响应的属性。
	 */
	getValue(): T;

	/**
	 * 修改当前元素关联的值
	 */
	setValue(val: T): void;

	reset(): void;
}
