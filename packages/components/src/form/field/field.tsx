// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Converter, Flatten, Flattenable, FlattenKeys } from '@cmfx/core';
import { createMemo, type JSX, mergeProps, type ParentProps, Show } from 'solid-js';

import { type BaseProps, type ChangeFunc, joinClass } from '@components/base';
import { ContextNotFoundError } from '@components/context';
import type { FormFieldAccessor } from '@components/form/api';
import { type CommonProps, useForm } from '@components/form/form';
import { area2Style, calcAreas } from './area';
import { createFakeField, FieldProvider } from './context';
import styles from './style.module.css';

export interface FormFieldProps<T extends Flattenable, F = Flatten<T>[FlattenKeys<T>]>
	extends CommonProps,
		BaseProps,
		ParentProps {
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
	 * 如果指定了该值，则必须要套在 Form 之内，会从 Form 中获取对应名称的字段值。
	 * 否则表示一个类似 label 的组件，用于包含一个带有数据的字段。
	 */
	readonly name?: FlattenKeys<T>;

	/**
	 * 对 name 指定的字段作个类型转换
	 *
	 * @remarks
	 * Field 的子元素接受的数据类型是固定的，如果碰到不同类型的数据，可以使用此转换，
	 * 比如 DatePicker 组件只接受 Date 类型的数据，但是某此接口可能使用了时间戳或是字符串表示时间，
	 * 可以在此字段指定一个将时间戳或是字符转换为 Date 的方法传递给子组件。
	 */
	readonly conv?: Converter<Flatten<T>[FlattenKeys<T>] | undefined, F | undefined>;
}

export function Field<T extends Flattenable, F = Flatten<T>[FlattenKeys<T>]>(props: FormFieldProps<T, F>): JSX.Element {
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
		} satisfies FormFieldProps<T, F>,
		form,
		props,
	);

	const areas = createMemo(() => calcAreas(props.layout!, props.feedback));

	// 如果未指定 name 属性，无法定位判断哪个字段，直接创建一个假的对象
	const field = props.name ? form!.api.createFieldAccessor(props.name) : createFakeField();

	const getValue = (
		props.conv
			? () => {
					const v = field.getValue();
					return v ? props.conv!.from(v as Flatten<T>[FlattenKeys<T>] | undefined) : v;
				}
			: field.getValue
	) as FormFieldAccessor<F>['getValue'];

	const setValue = (
		props.conv
			? (v, silent) => {
					field.setValue(v ? props.conv!.to(v) : undefined, silent);
				}
			: field.setValue
	) as FormFieldAccessor<F>['setValue'];

	const onChange = (
		props.conv && field.onChange
			? (f: ChangeFunc<F | undefined>) => {
					field.onChange((val, old) => {
						f(
							props.conv!.from(val as Flatten<T>[FlattenKeys<T>] | undefined),
							props.conv!.from(old as Flatten<T>[FlattenKeys<T>] | undefined),
						);
					});
				}
			: field.onChange
	) as FormFieldAccessor<F>['onChange'];

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

			<FieldProvider<F>
				class={styles.data}
				style={area2Style(areas().data)}
				id={field.id}
				name={field.name}
				reset={field.reset}
				getError={field.getError}
				setError={field.setError}
				getValue={getValue}
				setValue={setValue}
				onChange={onChange}
				getExtra={field.getExtra}
				setExtra={field.setExtra}
				isFake={('isFake' in field ? field?.isFake : undefined) as boolean}
				isolation={('isolation' in props ? props.isolation : undefined) as boolean}
			>
				{props.children}
			</FieldProvider>

			<Show when={areas().extra}>{e => <div style={area2Style(e())}>{field.getExtra()}</div>}</Show>
		</div>
	);
}
