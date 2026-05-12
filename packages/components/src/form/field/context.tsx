// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Context, JSX, ParentProps } from 'solid-js';
import { createContext, createEffect, createSignal, createUniqueId, splitProps, useContext } from 'solid-js';

import type { ChangeFunc } from '@components/base';
import type { FieldAccessor } from '@components/form/api';
import type { ValueProps } from './data';

export type FieldContext<T> = FieldAccessor<T>;

const fieldContext = createContext<FieldContext<unknown>>();

export function FieldProvider(props: ParentProps<FieldContext<unknown>>): JSX.Element {
	const [, val] = splitProps(props, ['children']);
	return <fieldContext.Provider value={val}>{props.children}</fieldContext.Provider>;
}

/**
 * 获取可以用于操作父元素 <Form.Field> 组件的接口
 *
 * @typeParam T - 表单项的值类型；
 * @param props - 如果 props.onChange 存在，则会将其注册到 {@link FieldContext}；
 * @param fake - 如果为 true，则在无法从元素中获取 {@link FieldContext} 时，会通过 {@link useFakeField} 创建一个假的上下文；
 */
export function useField<T>(props?: ValueProps<T>): FieldContext<T> | undefined;
export function useField<T>(props: ValueProps<T>, fake: true): FieldContext<T>;
export function useField<T>(props?: ValueProps<T>, fake?: true): FieldContext<T> | undefined {
	let ctx = useContext(fieldContext as Context<FieldContext<T>>);

	if (!ctx && fake) {
		ctx = useFakeField(props?.value, props?.onChange);
	}

	if (!ctx) {
		return undefined;
	}

	if (props?.onChange) {
		ctx.onChange(props.onChange);
	}

	createEffect(() => ctx.setValue(props?.value));

	return ctx;
}

/**
 * 创建一个假的 FieldContext 对象
 *
 * @remarks
 * 当通过 {@link useField} 无法获取到父元素的上下文时，可以使用该函数创建一个假的上下文。
 */
export function useFakeField<T>(val: T | undefined, onChange?: ChangeFunc<T | undefined>): FieldContext<T> {
	const preset = structuredClone(val);
	const [v, sv] = createSignal<T | undefined>(val);
	const [extra, setExtra] = createSignal<JSX.Element | undefined>();
	const id = createUniqueId();

	const changes: Array<ChangeFunc<T | undefined>> = [];
	if (onChange) {
		changes.push(onChange);
	}

	const setValue = (val: T | undefined) => {
		const old = v();
		sv(() => val);

		changes.forEach(cb => {
			cb(val, old);
		});
	};

	return {
		id: () => id,
		name: () => id,
		reset: () => setValue(structuredClone(preset)),

		setError: () => {},
		getError: () => undefined,

		getValue: v,
		setValue: setValue,
		onChange: (cb: ChangeFunc<T | undefined>) => changes.push(cb),

		getExtra: extra,
		setExtra: setExtra,
	};
}
