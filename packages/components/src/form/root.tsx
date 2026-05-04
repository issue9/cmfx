// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { createEffect, createSignal, createUniqueId, mergeProps, onMount } from 'solid-js';

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@components/base';
import { useLocale } from '@components/context';
import { Spin } from '@components/spin';
import type { API } from './api';
import { buildFieldContext, type FormContext, FormProvider } from './context';

export type Ref = BaseRef<HTMLFormElement>;

export interface Props<T extends Flattenable, R = never, P = never>
	extends BaseProps,
		Omit<FormContext<T>, 'createField'>,
		ParentProps,
		RefProps<Ref> {
	/**
	 * 表单位于对话框中
	 *
	 * @reactive
	 * @remarks
	 * 如果指定了该属性，那么表单的 submit 按钮将会关闭对话框，
	 * 且 submit 按钮的 value 属性会传递给 dialog.returnValue。
	 */
	inDialog?: boolean;

	/**
	 * 指定操作表单的 api
	 */
	api: API<T, R, P>;
}

export function Root<T extends Flattenable, R = never, P = never>(props: Props<T, R, P>): JSX.Element {
	const l = useLocale();

	props = mergeProps(
		{
			layout: 'horizontal',
		} as Props<T, R, P>,
		props,
	);

	const api = props.api;

	// 保证验证器的语言正确
	createEffect(() => {
		const loc = l;
		const v = api.validator();
		if (v) {
			v.changeLocale(loc);
		}
	});

	onMount(async () => {
		await api.load();
	});

	// 用以将 onsubmit 的异步异常转换为可以由 ErrorBoundary 捕获的同步异常。
	const [error, setError] = createSignal<Error>();
	createEffect(() => {
		if (error()) throw error();
	});

	const id = createUniqueId();

	return (
		<FormProvider<T>
			layout={props.layout}
			rounded={props.rounded}
			disabled={props.disabled}
			readonly={props.readonly}
			labelAlign={props.labelAlign}
			labelWidth={props.labelWidth}
			createField={(id, key) => buildFieldContext<T, R, P>(id, key, api)}
			id={id}
		>
			<Spin.Root
				tag="form"
				spinning={api.spinning()}
				palette={props.palette}
				class={joinClass(undefined, props.class)}
				style={props.style}
				ref={el => {
					el.root().addEventListener('submit', e => {
						api.submit().catch(setError);
						e.preventDefault();
					});

					el.root().addEventListener('reset', e => {
						api.reset();
						e.preventDefault();
					});

					el.root().id = id;
					if (props.inDialog) {
						el.root().method = 'dialog';
					}

					if (props.ref) {
						props.ref({
							root: el.root,
						});
					}
				}}
			>
				{props.children}
			</Spin.Root>
		</FormProvider>
	);
}
