// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, For, type JSX, mergeProps } from 'solid-js';

import type { AvailableEnumType, BaseProps, BaseRef, Layout, RefProps, ValueProps } from '@components/base';
import { joinClass, style2String } from '@components/base';
import { Form } from '@components/form';
import { Radio } from '@components/radio/radio';
import type { RadioGroupOptions } from './options';
import styles from './style.module.css';

export type RadioGroupRef = BaseRef<HTMLDivElement>;

export interface RadioGroupProps<T extends AvailableEnumType = string>
	extends BaseProps,
		Form.DataProps,
		ValueProps<T>,
		RefProps<RadioGroupRef> {
	/**
	 * 所有 checkbox 项的布局
	 *
	 * @remarks 同时也影响整个 Form 组件的布局。
	 * @reactive
	 * @defaultValue 'horizontal'
	 */
	layout?: Layout;

	/**
	 * 是否显示为块
	 *
	 * @reactive
	 */
	block?: boolean;

	/**
	 * 选择项
	 *
	 * @reactive
	 */
	options: RadioGroupOptions<T>;
}

/**
 * 单选框组
 */
export function RadioGroup<T extends AvailableEnumType = string>(props: RadioGroupProps<T>): JSX.Element {
	const field = Form.useField<T>(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const cls = createMemo(() => {
		return joinClass(
			props.palette,
			styles['group-content'],
			props.class,
			field.class,
			props.layout === 'vertical' ? 'flex-col' : '',
		);
	});

	createEffect(() => {
		if (props.value !== undefined) {
			field.setValue(props.value);
		}
	});

	return (
		<div
			style={style2String(props.style, field.style)}
			class={cls()}
			role="radiogroup"
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
					});
				}
			}}
			onKeyDown={e => {
				if (!props.block || props.disabled || props.readonly) {
					return;
				}

				const index = props.options.findIndex(v => v.value === field.getValue());

				let newIndex = index;
				if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
					newIndex -= 1;
					if (newIndex < 0) {
						newIndex = props.options.length - 1;
					}
				} else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
					newIndex += 1;
					if (newIndex > props.options.length - 1) {
						newIndex = 0;
					}
				}

				field.setValue(props.options[newIndex].value);
				field.setError();
				e.preventDefault();
			}}
		>
			<For each={props.options}>
				{item => (
					<Radio
						readonly={props.readonly}
						label={item.label}
						block={props.block}
						tabindex={field.getValue() === item.value ? props.tabindex : -1}
						disabled={props.disabled}
						checked={item.value === field.getValue()}
						rounded={props.rounded}
						value={field.getValue()}
						name={field.name()}
						onChange={() => {
							if (!props.readonly && !props.disabled && field.getValue() !== item.value) {
								field.setValue(item.value);
								field.setError();
							}
						}}
					/>
				)}
			</For>
		</div>
	);
}
