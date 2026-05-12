// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Flattenable, FlattenKeys } from '@cmfx/core';
import { createMemo, type JSX, mergeProps, type ParentProps } from 'solid-js';

import { type BaseProps, joinClass } from '@components/base';
import { ContextNotFoundError } from '@components/context';
import { type CommonProps, useForm } from '@components/form/form';
import { area2Style, calcAreas } from './area';
import { FieldProvider, useFakeField } from './context';
import styles from './style.module.css';

export interface FieldProps<T extends Flattenable> extends CommonProps, BaseProps, ParentProps {
	label?: JSX.Element;

	help?: JSX.Element;

	/**
	 * 字段名
	 *
	 * @remarks
	 * 如果指定了该值，则必须要套在 Form 之内，会从 Form 中获取对应名称的字段值。
	 * 否则表示一个类似 label 的组件，用于包含一个带有数据的字段。
	 */
	readonly name?: FlattenKeys<T>;
}

export function Field<T extends Flattenable>(props: FieldProps<T>): JSX.Element {
	// NOTE: 采用 grid 主要是方便对齐方式的实现。
	// 比如 label 应该是与 input 对象居中对齐，而不是 input+help 的整个元素；
	// help 应该与 input 左对齐，而不是与 label 左对齐。

	const form = useForm<T>();

	// 有 name 的情况下，必须要有 form
	if (!form && props.name) {
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

	const field = props.name ? form!.api.createFieldAccessor(props.name) : useFakeField(undefined);

	return (
		<div class={joinClass(props.palette, styles.field, props.class)} style={props.style}>
			<label
				for={field.id()}
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

			<div style={area2Style(areas().data)} class={styles.input}>
				<FieldProvider
					id={field.id}
					name={field.name}
					reset={field.reset}
					getError={field.getError}
					setError={field.setError}
					getValue={field.getValue}
					setValue={field.setValue}
					onChange={field.onChange}
					getExtra={field.getExtra}
					setExtra={field.setExtra}
				>
					{props.children}
				</FieldProvider>
			</div>

			<div style={area2Style(areas().extra)}>{field.getExtra()}</div>
		</div>
	);
}
