// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import type { ChangeFunc } from '@components/base';

/**
 * 定义了访问表单中某个字段的接口
 *
 * @typeParam T - 字段的值类型；
 */
export interface FieldAccessor<T> {
	/**
	 * 字段的唯一标识
	 */
	id(): string;

	/**
	 * 字段的名称
	 *
	 * @remarks
	 * 在某些场合下可能用到，比如可能会用在 radio group 中 input 的 name 属性。
	 */
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
	getValue(): T | undefined;

	/**
	 * 修改当前元素关联的值
	 */
	setValue(val: T | undefined): void;

	/**
	 * 注册值变化时的回调函数
	 */
	onChange(f: ChangeFunc<T | undefined>): void;

	/**
	 * 重置为默认值
	 */
	reset(): void;

	/**
	 * 获取当前元素关联的扩展字段
	 *
	 * @remarks
	 * 这是一个可响应的值
	 */
	getExtra(): JSX.Element | undefined;

	/**
	 * 修改当前元素关联的扩展字段
	 */
	setExtra(extra: JSX.Element | undefined): void;
}
