// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Context, JSX, ParentProps } from 'solid-js';
import { createContext, createEffect, createSignal, createUniqueId, splitProps, useContext } from 'solid-js';

import type { ChangeFunc, StyleProps, ValueProps } from '@components/base';
import type { FieldAccessor } from '@components/form/api';

export type FieldContext<T> = FieldAccessor<T> & StyleProps;

// inited 表示该上下文是否已经调用 useField 初始化过，这样可以防止多次调用 useField 多次注册 onChange 事件。
type FieldContextWithInited<T> = FieldContext<T> & { inited?: boolean };

const fieldContext = createContext<FieldContextWithInited<unknown>>();

export function FieldProvider(props: ParentProps<FieldContext<unknown>>): JSX.Element {
	const [, val] = splitProps(props, ['children']);
	return <fieldContext.Provider value={val}>{props.children}</fieldContext.Provider>;
}

/**
 * 获取可以用于操作父元素 <Form.Field> 组件的接口
 *
 * @typeParam T - 表单项的值类型；
 * @param props - 如果 props.onChange 存在，则会将其注册到 {@link FieldContext}，且会跟踪 props.value 的变化；
 * @param fake - 如果为 true，则在无法从元素中获取 {@link FieldContext} 时，会通过 {@link createFakeField} 创建一个假的上下文；
 */
export function useField<T>(props?: ValueProps<T>): FieldContext<T> | undefined;
export function useField<T>(props: ValueProps<T>, fake: true): FieldContext<T>;
export function useField<T>(props?: ValueProps<T>, fake?: true): FieldContext<T> | undefined {
	let ctx = useContext(fieldContext as Context<FieldContextWithInited<T>>);

	if (!ctx && fake) {
		ctx = createFakeField(props?.value, props?.onChange);
	}

	if (!ctx) {
		return undefined;
	}

	// 确保初始化一次
	if (ctx.inited) {
		return ctx;
	}

	if (props?.value !== undefined) {
		createEffect(() => {
			ctx.setValue(props.value);
		});
	}

	if (props?.onChange) {
		ctx.onChange(props.onChange);
	}

	ctx.inited = true;
	return ctx;
}

/**
 * 创建一个假的 FieldContext 对象
 *
 * @remarks
 * 当通过 {@link useField} 无法获取到父元素的上下文时，可以使用该函数创建一个假的上下文。
 */
export function createFakeField<T>(val: T | undefined, onChange?: ChangeFunc<T | undefined>): FieldContext<T> {
	const preset = structuredClone(val);
	const [v, sv] = createSignal<T | undefined>(val);
	const [extra, setExtra] = createSignal<JSX.Element | undefined>();
	const id = createUniqueId();

	const changes: Array<ChangeFunc<T | undefined>> = [];
	if (onChange) {
		changes.push(onChange);
	}

	const setValue = (val: T | undefined, silence?: boolean) => {
		const old = v();

		// 保持与 Form.API.createFieldAccessor 相同的功能，同值不触发事件。
		if (old === val) {
			return;
		}

		sv(() => val);

		if (!silence) {
			for (const f of changes) {
				f(val, old);
			}
		}
	};

	return {
		id: () => id,
		name: () => id,
		reset: (silence?: boolean) => setValue(structuredClone(preset), silence),

		setError: () => {},
		getError: () => undefined,

		getValue: v,
		setValue: setValue,
		onChange: (cb: ChangeFunc<T | undefined>) => changes.push(cb),

		getExtra: extra,
		setExtra: setExtra,
	};
}
