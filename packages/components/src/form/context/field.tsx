// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flatten, Flattenable, FlattenKeys } from '@cmfx/core';
import type { Context, JSX, ParentProps } from 'solid-js';
import { createContext, createSignal, createUniqueId, splitProps, useContext } from 'solid-js';

import type { API } from '@components/form/api';

export interface FieldContext<T> {
	id(): string;
	name(): string;

	reset(): void;

	setError(err?: string): void;
	getError(): string | undefined;

	getValue(): T;
	setValue(value: T): void;

	getExtra(): JSX.Element | undefined;
	setExtra(extra: JSX.Element | undefined): void;
}

interface FieldContextProps<T> {
	ctx: FieldContext<T>;
}

const fieldContext = createContext<FieldContext<unknown>>();

export function FieldProvider(props: ParentProps<FieldContextProps<unknown>>): JSX.Element {
	const [, val] = splitProps(props, ['children']);
	return <fieldContext.Provider value={val.ctx}>{props.children}</fieldContext.Provider>;
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
 * 多 api 中提取字段 name 包装成 {@link FieldContext} 对象
 */
export function buildFieldContext<T extends Flattenable, R = never, P = never>(
	id: string,
	name: FlattenKeys<T>,
	api: API<T, R, P>,
): FieldContext<Flatten<T>[FlattenKeys<T>]> {
	const access = api.createFieldAccessor<Flatten<T>[FlattenKeys<T>]>(name);
	const extra = createSignal<JSX.Element>();

	return {
		id: () => id,
		name: () => name,

		reset: () => access.reset(),

		getError: () => access.getError(),
		setError: err => access.setError(err),

		getValue: () => access.getValue(),
		setValue: val => access.setValue(val),

		getExtra: () => extra[0](),
		setExtra: e => extra[1](e),
	};
}

/**
 * 将 val 包装成 {@link FieldContext} 对象
 */
export function buildFakeFieldContext<T>(val: T): FieldContext<T> {
	const preset = structuredClone(val);
	const [v, sv] = createSignal<T>(val);
	const id = createUniqueId();

	return {
		id: () => id,
		name: () => id,

		reset: () => sv(() => preset),

		setError: () => {},
		getError: () => undefined,

		getValue: v,
		setValue: sv,

		getExtra: () => undefined,
		setExtra: () => {},
	};
}
