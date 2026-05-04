// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { createEffect, createSignal, createUniqueId, mergeProps, onMount, Show } from 'solid-js';

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import { Alert } from '@components/notify';
import { Spin } from '@components/spin';
import type { API } from './api';
import { type Context, Provider, useForm } from './context';

export type Ref = BaseRef<HTMLFormElement>;

export interface Props<T extends Flattenable, R = never, P = never>
	extends BaseProps,
		Context,
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

export interface MessageProps<T extends Flattenable, R = never, P = never> extends BaseProps {
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

	api: API<T, R, P>;
}

/**
 * 显示整个表单的错误信息
 */
export function Message<T extends Flattenable, R = never, P = never>(props: MessageProps<T, R, P>): JSX.Element {
	return (
		<Show when={props.api.getError()}>
			{err => (
				<Alert.Root
					closable={props.closable}
					duration={props.duration}
					type="error"
					title={err()}
					class={props.class}
					style={props.style}
					onClose={async () => {
						props.api.setError();
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
export function ButtonAction(props: Button.ButtonProps): JSX.Element {
	const f = useForm();
	return <Button.Root {...mergeProps({ disabled: f?.disabled, rounded: f?.rounded, form: f?.formID }, props)} />;
}

/**
 * 重置按钮
 *
 * @remarks
 * 按钮可以在表单之外，点击时会正确触发对应的表单事件。
 */
export function Reset(props: Omit<Button.ButtonProps, 'onclick' | 'type'>): JSX.Element {
	return <ButtonAction {...props} type="reset" />;
}

/**
 * 提交按钮
 *
 * @remarks
 * 如果指定了 {@link Props#inDialog} 属性，那么表单的 submit 按钮将会关闭所在的对话框，
 * 且 submit 按钮的 value 属性会传递给 dialog.returnValue。
 * 按钮可以在表单之外，点击时会正确触发对应的表单事件。
 */
export function Submit(props: Omit<Button.ButtonProps, 'onclick' | 'type'>): JSX.Element {
	return <ButtonAction {...props} type="submit" />;
}

/**
 * 表单组件
 *
 * @typeParam T - 表示需要提交的对象类型；
 * @typeParam R - 表示服务端返回的类型；
 * @typeParam P - 表示服务端出错是返回的 {@link Problem#extension} 类型；
 */
export function Root<T extends Flattenable, R = never, P = never>(props: Props<T, R, P>): JSX.Element {
	const l = useLocale();

	props = mergeProps(
		{
			layout: 'horizontal',
			hasHelp: true,
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
		<Provider
			layout={props.layout}
			hasHelp={props.hasHelp}
			rounded={props.rounded}
			disabled={props.disabled}
			readonly={props.readonly}
			labelAlign={props.labelAlign}
			labelWidth={props.labelWidth}
			formID={id}
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
		</Provider>
	);
}
