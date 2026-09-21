// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BaseRef, FormField, RefProps, StyleProps, ThemeProps } from '@cmfx/cdk';
import { createFormField, FormFieldProvider, joinClass, useFormField as useXFormField } from '@cmfx/cdk';
import type { Converter, Flatten, Flattenable, FlattenKeys } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { createContext, createMemo, createUniqueId, mergeProps, Show, splitProps, useContext } from 'solid-js';

import { type CommonProps, useForm } from '@components/form/form';
import { area2Style, calcAreas } from './area';
import styles from './style.module.css';

export type FormFieldRef = BaseRef<HTMLDivElement>;

export interface FormFieldProps<T extends Flattenable, F = Flatten<T>[FlattenKeys<T>]>
	extends CommonProps,
		ThemeProps,
		ParentProps,
		RefProps<FormFieldRef> {
	/**
	 * 字段标签
	 *
	 * @reactive
	 */
	label?: JSX.Element;

	/**
	 * 帮助信息
	 *
	 * @remarks
	 * 该区域在有错误信息时会显示错误信息，否则显示帮助信息。
	 *
	 * @reactive
	 */
	help?: JSX.Element;
	/**
	 * 字段名
	 *
	 * @remarks
	 * 如果指定了该值，表示的值为表单中的数据，否则表示创建一个非表单中的数据。
	 */
	readonly name?: FlattenKeys<T>;

	readonly id?: string;

	readonly conv?: Converter<Flatten<T>[FlattenKeys<T>] | undefined, F | undefined>;
}

export interface FormFieldContext<T> extends StyleProps {
	api: FormField<T>;

	fieldRef?: FormFieldRef;
}

const formFieldContext = createContext<FormFieldContext<unknown> | undefined>(undefined);

function Internal<T extends Flattenable, F = Flatten<T>[FlattenKeys<T>]>(props: FormFieldProps<T, F>): JSX.Element {
	const areas = createMemo(() => calcAreas(props.layout!, props.feedback, !!props.label));

	// 如果未指定 name 属性，无法定位判断哪个字段，直接创建一个假的对象
	const field = props.name ? useXFormField<T, F>(props.conv) : createFormField<F>(props.id ?? createUniqueId());

	let ref: FormFieldRef;

	return (
		<div
			class={joinClass(props.palette, styles.field, props.class)}
			style={props.style}
			ref={el => {
				ref = { root: () => el };
				props.ref?.({ root: () => el });
			}}
		>
			<Show when={areas().label}>
				{c => (
					<label
						for={field.id}
						style={{
							...area2Style(c()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
							cursor: 'default',
						}}
					>
						{props.label}
					</label>
				)}
			</Show>

			<Show when={areas().help}>
				{h => (
					<p
						style={area2Style(h())}
						role="alert"
						class={joinClass(undefined, styles.help, field.getError() ? styles.error : '')}
					>
						{field.getError() ?? props.help}
					</p>
				)}
			</Show>
			<formFieldContext.Provider
				value={{ class: styles.data, style: area2Style(areas().data), api: field, fieldRef: ref! }}
			>
				{props.children}
			</formFieldContext.Provider>
			<Show when={areas().extra}>{e => <div style={area2Style(e())}>{field.getExtra()}</div>}</Show>
		</div>
	);
}

export function useField<F>(fake: true): FormFieldContext<F>;
export function useField<F>(): FormFieldContext<F> | undefined;
export function useField<F>(fake?: true): FormFieldContext<F> | undefined {
	const ctx = useContext(formFieldContext);
	return fake
		? ((ctx ?? { api: createFormField<F>(createUniqueId()) }) as FormFieldContext<F>)
		: (ctx as FormFieldContext<F> | undefined);
}

export function IsolationField(props: ParentProps): JSX.Element {
	return <FormFieldProvider isolation>{props.children}</FormFieldProvider>;
}

export function Field<T extends Flattenable>(props: FormFieldProps<T>): JSX.Element {
	// NOTE: 采用 grid 主要是方便对齐方式的实现。
	// 比如 label 应该是与 input 对象居中对齐，而不是 input+help 的整个元素；
	// help 应该与 input 左对齐，而不是与 label 左对齐。

	const form = props.name ? useForm<T>() : undefined;

	props = mergeProps(
		{
			layout: 'horizontal',
			labelAlign: (form?.layout ?? props.layout ?? 'horizontal') === 'horizontal' ? 'end' : 'start',
		} satisfies FormFieldProps<T>,
		form,
		props,
	);

	const [, ips] = splitProps(props, ['children']);

	return (
		<FormFieldProvider<T> name={props.name} id={props.id}>
			<Internal {...ips}>{props.children}</Internal>
		</FormFieldProvider>
	);
}
