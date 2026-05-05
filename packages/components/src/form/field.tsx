// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable, FlattenKeys } from '@cmfx/core';
import { createMemo, createUniqueId, type JSX, mergeProps, type ParentProps } from 'solid-js';

import { type BaseProps, joinClass } from '@components/base';
import { ContextNotFoundError } from '@components/context';
import { area2Style, calcAreas } from './area';
import { type CommonProps, FieldProvider, useForm } from './context';
import styles from './style.module.css';

export interface FieldProps<T extends Flattenable> extends CommonProps, BaseProps, ParentProps {
	label?: JSX.Element;

	help?: JSX.Element;

	tabindex?: number;

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

	const id = createUniqueId();
	props = mergeProps(
		{
			layout: 'horizontal',
			labelAlign: (form?.layout ?? props.layout ?? 'horizontal') === 'horizontal' ? 'end' : 'start',
		} as FieldProps<T>,
		{
			layout: form?.layout,
			disabled: form?.disabled,
			readonly: form?.readonly,
			rounded: form?.rounded,
			labelWidth: form?.labelWidth,
			labelAlign: (form?.layout ?? props.layout ?? 'horizontal') === 'horizontal' ? 'end' : 'start',
		} as FieldProps<T>,
		props,
	);

	const areas = createMemo(() => calcAreas(props.layout!));

	const field = form.createField(id, props.name, props.tabindex);

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
				<FieldProvider ctx={field}>{props.children}</FieldProvider>
			</div>

			<div style={area2Style(areas().extra)}>{field.getExtra()}</div>
		</div>
	);
}
