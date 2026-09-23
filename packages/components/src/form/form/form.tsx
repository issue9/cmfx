// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BaseRef, FormContext as FC, FormProviderProps, RefProps, ThemeProps } from '@cmfx/cdk';
import { ContextNotFoundError, FormProvider, joinClass, useForm as useXForm } from '@cmfx/cdk';
import { type Flattenable, LogicError } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import {
	createContext,
	createEffect,
	createSignal,
	createUniqueId,
	mergeProps,
	Show,
	splitProps,
	useContext,
} from 'solid-js';

import { Button as Btn } from '@components/button/button';
import { Alert } from '@components/notify';
import type { CommonProps } from './types';

export interface FormRef<T extends Flattenable = Flattenable, R = unknown, P = never> extends BaseRef<HTMLFormElement> {
	/**
	 * 提供操作表单的接口
	 */
	api(): FC<T, R, P>;
}

interface FormAttrs extends CommonProps {
	/**
	 * 表单的 id 属性
	 */
	id?: string;
}

interface FormPropsBase<T extends Flattenable = Flattenable, R = unknown, P = never>
	extends ThemeProps,
		FormAttrs,
		ParentProps,
		RefProps<FormRef<T, R, P>> {
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

type FormPropsWithAPI<T extends Flattenable = Flattenable, R = unknown, P = never> = FormPropsBase<T, R, P> &
	Extract<FormProviderProps<T, R, P>, { api: unknown }>;

type FormPropsWithOptions<T extends Flattenable = Flattenable, R = unknown, P = never> = FormPropsBase<T, R, P> &
	Exclude<FormProviderProps<T, R, P>, { api: unknown }>;

export type FormProps<T extends Flattenable = Flattenable, R = unknown, P = never> =
	| FormPropsWithAPI<T, R, P>
	| FormPropsWithOptions<T, R, P>;

export type FormContext<T extends Flattenable = Flattenable, R = unknown, P = never> = FormAttrs & {
	/**
	 * 提供操作表单的接口
	 */
	api: FC<T, R, P>;
};

const formContext = createContext<FormContext | undefined>(undefined);

function InternalForm<T extends Flattenable = Flattenable, R = unknown, P = never>(
	props: FormProps<T, R, P>,
): JSX.Element {
	props = mergeProps({ id: createUniqueId() }, props);

	const api = useXForm<T, R, P>();
	if (!api) {
		throw new ContextNotFoundError('@cmfx/cdk.formContext');
	}

	// 用以将 onsubmit 的异步异常转换为可以由 ErrorBoundary 捕获的同步异常。
	const [error, setError] = createSignal<Error>();
	createEffect(() => {
		if (error()) throw error();
	});

	return (
		<form
			class={joinClass(props.palette, props.class)}
			style={props.style}
			id={props.id}
			ref={el => {
				el.addEventListener('submit', e => {
					api.submit().catch(setError);
					e.preventDefault();
				});

				el.addEventListener('reset', e => {
					api.reset();
					e.preventDefault();
				});

				if (props.inDialog) {
					el.method = 'dialog';
				}

				props.ref?.({ root: () => el, api: () => api });
			}}
		>
			<formContext.Provider
				value={{
					id: props.id,
					layout: props.layout,
					labelAlign: props.labelAlign,
					labelWidth: props.labelWidth,
					rounded: props.rounded,
					feedback: props.feedback,
					api: api as FC,
				}}
			>
				{props.children}
			</formContext.Provider>
		</form>
	);
}

/**
 * 表单组件
 */
export function Form<T extends Flattenable, R = unknown, P = never>(props: FormProps<T, R, P>): JSX.Element {
	props = mergeProps(
		{
			layout: 'horizontal',
		} as FormProps<T, R, P>,
		props,
	);

	const [, formProps] = splitProps(props, [
		'ref',
		'children',
		'inDialog',
		'class',
		'palette',
		'style',
		'layout',
		'rounded',
		'labelAlign',
		'labelWidth',
		'feedback',
		'id',
	]);

	return (
		<FormProvider<T, R, P> {...formProps}>
			<InternalForm {...props}>{props.children}</InternalForm>
		</FormProvider>
	);
}

/**
 * 获取上下文中的表单对象
 *
 * @returns 若是在 {@link Form} 之外调用将返回 undefined
 */
export function useForm<T extends Flattenable = Flattenable, R = unknown, P = never>():
	| FormContext<T, R, P>
	| undefined {
	return useContext(formContext) as FormContext<T, R, P> | undefined;
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
	const f = useXForm();
	if (!f) {
		throw new LogicError('只能在 @cmfx/components 的 Form 组件之内使用');
	}

	return (
		<Show when={f.getError()}>
			{err => (
				<Alert
					duration={props.duration}
					type="error"
					title={err()}
					class={props.class}
					style={props.style}
					onClose={async () => {
						f.setError();
						return false;
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
	return (
		<Btn {...mergeProps({ disabled: f?.api.getState() === 'disabled', rounded: f?.rounded, form: f?.id }, props)} />
	);
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
