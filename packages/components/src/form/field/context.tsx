// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import equal from 'fast-deep-equal';
import type { Context, JSX, ParentProps } from 'solid-js';
import { createContext, createEffect, createSignal, createUniqueId, splitProps, untrack, useContext } from 'solid-js';

import type { ChangeFunc, StyleProps, ValueProps } from '@components/base';
import type { FieldAccessor } from '@components/form/api';

export type FieldContext<T> = FieldAccessor<T> &
	StyleProps & {
		/**
		 * 表示该上下文环境的值是否真的是从 <Form.Field> 中获取的
		 *
		 * @remarks
		 * 当 Form.Field 未指定 name 属性时，会创建一个假的对象供 Form.useField 返回。
		 * 通过当前属性可判断该对象是否真的源自 Form.Field.name 指定的数据对象。
		 */
		isFake?: boolean;
	};

// inited 表示该上下文是否已经调用 useField 初始化过，这样可以防止多次调用 useField 多次注册 onChange 事件。
type FieldContextWithInited<T> = FieldContext<T> & { inited?: boolean };

const fieldContext = createContext<FieldContextWithInited<unknown>>();

export type FieldProviderProps<T> = ParentProps<
	| (FieldContext<T> & { isolation?: false })
	| {
			/**
			 * 隔离一个位于 <Form.Field> 之内的组件，使其看起来像是不在 <Form.Field> 之内的。
			 */
			isolation: true;
	  }
>;

export function FieldProvider<T>(props: FieldProviderProps<T>): JSX.Element {
	const [, val] = splitProps(props, ['children', 'isolation']);

	if (props.isolation) {
		return <fieldContext.Provider value={undefined}>{props.children}</fieldContext.Provider>;
	}
	return <fieldContext.Provider value={val as FieldContext<T>}>{props.children}</fieldContext.Provider>;
}

/**
 * 获取可以用于操作父元素 Form.Field 组件的接口
 *
 * @typeParam T - 表单项的值类型；
 * @param props - 如果 props.onChange 存在，则会将其注册到 {@link FieldContext}，且会跟踪 props.value 的变化；
 * @param fake - 如果为 true，则在无法从上下文中获取对象时，会创建一个假的对象返回；
 *
 * @remarks
 * 所有在位于 Form.Field 内部的组件中调用的 useField 都会返回一个对象，若需要在外部调用，需要传入 {@link fake} 参数。
 *
 * NOTE: 如果在一个用 useField 的组件之内，嵌套了另一个使用 useField 的组件，
 * 可以使用 {@link FieldProvider} 重新将 {@link FieldContext} 提供给内部组件。
 * 或是使用将 isolation 属性设置为 true 的 {@link FieldProvider} 来隔离内部组件的上下文。
 */
export function useField<T>(props?: ValueProps<T>): FieldContext<T> | undefined;
export function useField<T>(props: ValueProps<T>, fake: true): FieldContext<T>;
export function useField<T>(props?: ValueProps<T>, fake?: true): FieldContext<T> | undefined {
	let ctx = useContext(fieldContext as Context<FieldContextWithInited<T>>);

	// 如果位于 Form.Field 外部，且需要创建假的上下文
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

	if (props && !ctx.isFake) {
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

	const setValue = (val: T | undefined, silent?: boolean) => {
		const old = untrack(v);

		// 保持与 Form.API.createFieldAccessor 相同的功能，同值不触发事件。
		if (equal(old, val)) {
			return;
		}

		sv(() => val);

		if (!silent) {
			for (const f of changes) {
				f(val, old);
			}
		}
	};

	return {
		id: () => id,
		name: () => id,
		reset: (silent?: boolean) => setValue(structuredClone(preset), silent),

		setError: () => {},
		getError: () => undefined,

		getValue: v,
		setValue: setValue,
		onChange: (cb: ChangeFunc<T | undefined>) => changes.push(cb),

		getExtra: extra,
		setExtra: setExtra,
		isFake: true,
	};
}
