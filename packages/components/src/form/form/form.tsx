// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { ContextNotFoundError, type Flattenable } from '@cmfx/core';
import { joinClass, type ThemeProps } from '@cmfx/themes';
import type { JSX, ParentProps } from 'solid-js';
import { createEffect, createSignal, createUniqueId, mergeProps, onMount, Show } from 'solid-js';

import type { BaseRef, RefProps } from '@components/base';
import { Button as Btn } from '@components/button/button';
import { useLocale } from '@components/context';
import { Alert } from '@components/notify';
import { Spin } from '@components/spin';
import { type FormContext, FormProvider, useForm } from './context';

export type FormRef = BaseRef<HTMLFormElement>;

export interface FormProps<T extends Flattenable, R = unknown, P = never>
	extends ThemeProps,
		FormContext<T, R, P>,
		ParentProps,
		RefProps<FormRef> {
	/**
	 * 表单位于对话框中
	 *
	 * @reactive
	 * @remarks
	 * 如果指定了该属性，那么表单的 submit 按钮将会关闭对话框，
	 * 且 submit 按钮的 value 属性会传递给 dialog.returnValue。
	 */
	inDialog?: boolean;
}

export function Form<T extends Flattenable, R = unknown, P = never>(props: FormProps<T, R, P>): JSX.Element {
	const l = useLocale();

	props = mergeProps(
		{
			layout: 'horizontal',
		} as FormProps<T, R, P>,
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
		<Spin
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
			<FormProvider<T, R, P>
				layout={props.layout}
				rounded={props.rounded}
				disabled={props.disabled}
				readonly={props.readonly}
				labelAlign={props.labelAlign}
				labelWidth={props.labelWidth}
				feedback={props.feedback}
				api={props.api}
				id={id}
			>
				{props.children}
			</FormProvider>
		</Spin>
	);
}

export interface FormMessageProps extends ThemeProps {
	/**
	 * 是否显示关闭按钮
	 *
	 * @reactive
	 */
	closable?: boolean;

	/**
	 * 非空值表示组件展示的时长
	 *
	 * @reactive
	 */
	duration?: number;
}

/**
 * 显示整个表单的错误信息
 */
export function Message(props: FormMessageProps): JSX.Element {
	const f = useForm();
	if (!f) {
		throw new ContextNotFoundError('formContext');
	}

	return (
		<Show when={f.api.getError()}>
			{err => (
				<Alert
					closable={props.closable}
					duration={props.duration}
					type="error"
					title={err()}
					class={props.class}
					style={props.style}
					onClose={async () => {
						f.api.setError();
						return undefined;
					}}
				/>
			)}
		</Show>
	);
}

/**
 * 普通的按钮，但是可以跟随 {@link Context#rounded} 属性变化
 */
export function Button(props: Btn.NormalProps): JSX.Element {
	const f = useForm();
	return <Btn {...mergeProps({ disabled: f?.disabled, rounded: f?.rounded, form: f?.id }, props)} />;
}

/**
 * 重置按钮
 *
 * @remarks
 * 按钮可以在表单之外，点击时会正确触发对应的表单事件。
 */
export function Reset(props: Omit<Btn.NormalProps, 'onclick' | 'type'>): JSX.Element {
	return <Button {...props} type="reset" />;
}

/**
 * 提交按钮
 *
 * @remarks
 * 如果指定了 {@link FormProps#inDialog} 属性，那么表单的 submit 按钮将会关闭所在的对话框，
 * 且 submit 按钮的 value 属性会传递给 dialog.returnValue。
 * 按钮可以在表单之外，点击时会正确触发对应的表单事件。
 */
export function Submit(props: Omit<Btn.NormalProps, 'onclick' | 'type'>): JSX.Element {
	return <Button {...props} type="submit" />;
}
