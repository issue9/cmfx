// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import { createMemo, type JSX, mergeProps } from 'solid-js';

import type { AvailableEnumType, BaseRef, RefProps } from '@components/base';
import styles from './style.module.css';

export interface RadioRef extends BaseRef<HTMLLabelElement> {
	/**
	 * 组件的 input 元素
	 */
	input(): HTMLInputElement;
}

export interface RadioProps<T extends AvailableEnumType = string> extends ThemeProps, RefProps<RadioRef> {
	tabindex?: number;

	label?: JSX.Element;

	/**
	 * 表单组件的 rounded 属性的默认值
	 *
	 * @reactive
	 */
	rounded?: boolean;

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
	 * 是否显示为块
	 *
	 * @remarks
	 * 是否隐藏原本的单选按钮，只显示文本内容配以边框。
	 *
	 * @reactive
	 */
	block?: boolean;

	/**
	 * 复选框的初始状态，true 为选中，false 为未选中。
	 *
	 * @reactive
	 */
	checked?: boolean;

	onChange?: (v?: boolean) => void;

	/**
	 * 字段名称
	 *
	 * @reactive
	 */
	name?: string;

	value?: T;
}

/**
 * 带文本提示的单选框
 */
export function Radio<T extends AvailableEnumType = string>(props: RadioProps<T>): JSX.Element {
	props = mergeProps({ tabindex: 0 } as RadioProps<T>, props);

	const cls = createMemo(() => {
		return joinClass(
			props.palette,
			props.block ? styles.block : '',
			props.rounded ? styles.rounded : '',
			props.readonly ? styles.readonly : '',
			styles.radio,
			props.class,
		);
	});

	let rootRef: HTMLLabelElement;
	return (
		<label class={cls()} style={props.style} tabindex={props.block ? props.tabindex : -1} ref={el => (rootRef = el)}>
			<input
				type="radio"
				checked={props.checked}
				class={joinClass(undefined, props.rounded ? styles.rounded : '')}
				disabled={props.disabled}
				name={props.name}
				aria-hidden={props.block}
				onclick={e => {
					if (e.target !== e.currentTarget) {
						return;
					}

					if (props.readonly) {
						e.preventDefault();
					}
					e.stopPropagation();
				}}
				onChange={e => {
					if (!props.readonly && !props.disabled && props.onChange) {
						props.onChange(e.currentTarget.checked);
					}
				}}
				ref={el => {
					if (props.ref) {
						props.ref({
							root: () => rootRef,
							input: () => el,
						});
					}
				}}
			/>
			{props.label}
		</label>
	);
}
