// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { createContext, createEffect, mergeProps, onMount, splitProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@cdk/errors';
import type { FormAttrs, FormContextOptions, FormState } from '@cdk/form/types';
import { useLocale } from '@cdk/locale';
import { StateProvider } from '@cdk/state';
import { FormContext } from './context';

const formContext = createContext<FormContext>();

export interface FormProviderProps<T extends Flattenable, R = unknown, PE = never>
	extends FormContextOptions<T, R, PE> {
	/**
	 * 表单状态
	 *
	 * @reactive
	 * @defaultValue 'enabled'
	 */
	state?: FormState;
}

/**
 * 提供表单的基本接口
 */
export function FormProvider<
	A extends FormAttrs = FormAttrs,
	T extends Flattenable = Flattenable,
	R = unknown,
	PE = never,
>(props: ParentProps<FormProviderProps<T, R, PE>>): JSX.Element {
	props = mergeProps({ state: 'enabled' as FormState }, props);
	const [, opt] = splitProps(props, ['children', 'state']);
	const l = useLocale();

	const api = new FormContext<A, T, R, PE>(opt);

	onMount(async () => await api.load());

	// 监视状态变化
	createEffect(() => api.setState(props.state!));

	// 保证验证器的语言正确
	createEffect(() => {
		const loc = l;
		const v = api.validator();
		if (v) {
			v.changeLocale(loc.locale.toString());
		}
	});

	return (
		<formContext.Provider value={api as unknown as FormContext}>
			<StateProvider state={api.getState()}>{props.children}</StateProvider>
		</formContext.Provider>
	);
}

export function useForm<
	A extends FormAttrs = FormAttrs,
	T extends Flattenable = Flattenable,
	R = unknown,
	PE = never,
>(): FormContext<A, T, R, PE> {
	const ctx = useContext(formContext);
	if (!ctx) {
		throw new ContextNotFoundError('@cmfx/cdk.formContext');
	}
	return ctx as unknown as FormContext<A, T, R, PE>;
}
