// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable, FlattenKeys } from '@cmfx/core';
import { createMemo, createSignal, createUniqueId, type JSX, mergeProps, type ParentProps } from 'solid-js';

import { type BaseProps, joinClass } from '@components/base';
import { ContextNotFoundError } from '@components/context';
import { area2Style, calcAreas } from './area';
import { type CommonProps, FieldProvider, useForm } from './context';
import styles from './style.module.css';

export interface FieldProps<T extends Flattenable> extends CommonProps, BaseProps, ParentProps {
	label?: JSX.Element;

	help?: JSX.Element;

	/**
	 * 字段名
	 */
	name: FlattenKeys<T>;
}

export function Field<T extends Flattenable>(props: FieldProps<T>): JSX.Element {
	// NOTE: 采用 grid 主要是方便对齐方式的实现。
	// 比如 label 应该是与 input 对象居中对齐，而不是 input+help 的整个元素；
	// help 应该与 input 左对齐，而不是与 label 左对齐。

	const form = useForm<T>();
	if (!form) {
		throw new ContextNotFoundError('formContext');
	}

	props = mergeProps(
		{
			layout: 'horizontal',
			labelAlign: (form?.layout ?? props.layout ?? 'horizontal') === 'horizontal' ? 'end' : 'start',
		} as FieldProps<T>,
		form,
		props,
	);

	const areas = createMemo(() => calcAreas(props.layout!));

	const id = createUniqueId();
	const field = form.api.createFieldAccessor(props.name);
	const [extra, setExtra] = createSignal<JSX.Element>();

	return (
		<div class={joinClass(props.palette, styles.field, props.class)} style={props.style}>
			<label
				for={id}
				style={{
					...area2Style(areas().label),
					width: props.labelWidth,
					'text-align': props.labelAlign,
					cursor: 'default',
				}}
			>
				{props.label}
			</label>

			<p
				style={area2Style(areas().help)}
				role="alert"
				class={joinClass(undefined, styles.help, field.getError() ? styles.error : '')}
			>
				{field.getError() ?? props.help}
			</p>

			<div style={area2Style(areas().input)}>
				<FieldProvider
					id={id}
					name={field.name}
					reset={field.reset}
					getError={field.getError}
					setError={field.setError}
					getValue={field.getValue}
					setValue={field.setValue}
					getExtra={extra}
					setExtra={setExtra}
				>
					{props.children}
				</FieldProvider>
			</div>

			<div style={area2Style(areas().extra)}>{extra()}</div>
		</div>
	);
}
