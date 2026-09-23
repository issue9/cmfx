// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { createContext, createEffect, mergeProps, onMount, splitProps, useContext } from 'solid-js';

import type { FormContextOptions } from '@cdk/form/types';
import { useLocale } from '@cdk/locale';
import { type State, StateProvider } from '@cdk/state';
import { FormContext } from './context';

// useForm 有可能在 FormProvider 之外使用，允许返回 undefined
const formContext = createContext<FormContext | undefined>(undefined);

interface StateProps {
	/**
	 * 表单状态
	 *
	 * @reactive
	 * @defaultValue 'enabled'
	 */
	state?: State;
}

type FormProviderPropsWithOptions<T extends Flattenable, R = unknown, PE = never> = StateProps &
	FormContextOptions<T, R, PE>;

type FormProviderPropsWithContext<T extends Flattenable, R = unknown, PE = never> = StateProps & {
	api: FormContext<T, R, PE>;
};

export type FormProviderProps<T extends Flattenable, R = unknown, PE = never> =
	| FormProviderPropsWithOptions<T, R, PE>
	| FormProviderPropsWithContext<T, R, PE>;

/**
 * 提供表单的基本接口
 */
export function FormProvider<T extends Flattenable = Flattenable, R = unknown, PE = never>(
	props: ParentProps<FormProviderProps<T, R, PE>>,
): JSX.Element {
	props = mergeProps({ state: 'enabled' as State }, props);
	const [, opt] = splitProps(props, ['children', 'state']);
	const l = useLocale();

	const ctx = 'api' in opt ? opt.api : new FormContext<T, R, PE>(opt);

	onMount(async () => await ctx.load());

	// 监视状态变化
	createEffect(() => ctx.setState(props.state!));

	// 保证验证器的语言正确
	createEffect(() => {
		const loc = l;
		const v = ctx.validator();
		if (v) {
			v.changeLocale(loc.locale.toString());
		}
	});

	return (
		<formContext.Provider value={ctx as unknown as FormContext}>
			<StateProvider state={ctx.getState()}>{props.children}</StateProvider>
		</formContext.Provider>
	);
}

// 获取当前上下文的表单接口
//
// @returns 如果不在 {@link FormProvider} 之内会返回 undefined
export function useForm<T extends Flattenable = Flattenable, R = unknown, PE = never>():
	| FormContext<T, R, PE>
	| undefined {
	return useContext(formContext) as unknown as FormContext<T, R, PE>;
}
