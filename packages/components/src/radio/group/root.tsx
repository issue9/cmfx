// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, type JSX, mergeProps } from 'solid-js';

import type { AvailableEnumType, BaseProps, BaseRef, ChangeFunc, Layout, RefProps } from '@components/base';
import { joinClass } from '@components/base';
import { Form } from '@components/form';
import * as Radio from '@components/radio/radio/mod';
import type { Options } from './options';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props<T extends AvailableEnumType = string> extends BaseProps, RefProps<Ref> {
	/**
	 * 禁用组件
	 *
	 * @reactive
	 */
	disabled?: boolean;

	/**
	 * 只读属性
	 *
	 * @reactive
	 */
	readonly?: boolean;

	/**
	 * 所有 checkbox 项的布局
	 *
	 * @remarks 同时也影响整个 Form 组件的布局。
	 * @reactive
	 * @defaultValue 'horizontal'
	 */
	layout?: Layout;

	/**
	 * 表单组件的 rounded 属性的默认值
	 *
	 * @reactive
	 */
	rounded?: boolean;

	/**
	 * tabindex 属性
	 *
	 * @reactive
	 * @defaultValue 0
	 */
	tabindex?: number;

	label?: JSX.Element;

	/**
	 * 提示信息
	 */
	help?: JSX.Element;

	/**
	 * 值
	 *
	 * @reactive
	 */
	value?: T;

	onChange?: ChangeFunc<T>;

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
	options: Options<T>;
}

/**
 * 单选框组
 */
export function Root<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
	const field = Form.useField<T>() ?? Form.buildFakeFieldContext(props.value);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const cls = createMemo(() => {
		return joinClass(
			props.palette,
			styles['group-content'],
			props.class,
			props.layout === 'vertical' ? 'flex-col' : '',
		);
	});

	return (
		<div
			style={props.style}
			class={cls()}
			role="radiogroup"
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
					<Radio.Root
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

								if (props.onChange) {
									props.onChange(item.value);
								}
							}
						}}
					/>
				)}
			</For>
		</div>
	);
}
