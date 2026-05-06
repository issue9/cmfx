// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Context, JSX, ParentProps } from 'solid-js';
import { createContext, createSignal, createUniqueId, splitProps, useContext } from 'solid-js';

import type { FieldAccessor } from '@components/form/api';

export interface FieldContext<T> extends FieldAccessor<T> {
	id: string;

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

const fieldContext = createContext<FieldContext<unknown>>();

export function FieldProvider(props: ParentProps<FieldContext<unknown>>): JSX.Element {
	const [, val] = splitProps(props, ['children']);
	return <fieldContext.Provider value={val}>{props.children}</fieldContext.Provider>;
}

/**
 * 获取可以用于操作父元素 <Form.Field> 组件的接口
 *
 * @typeParam T - 表单项的值类型；
 */
export function useField<T>(): FieldContext<T> | undefined {
	return useContext(fieldContext as Context<FieldContext<T>>);
}

/**
 * 将 val 包装成 {@link FieldContext} 对象
 */
export function buildFakeFieldContext<T>(val: T): FieldAccessor<T> {
	const preset = structuredClone(val);
	const [v, sv] = createSignal<T>(val);
	const id = createUniqueId();

	return {
		name: () => id,
		reset: () => sv(() => preset),

		setError: () => {},
		getError: () => undefined,

		getValue: v,
		setValue: sv,
	};
}
