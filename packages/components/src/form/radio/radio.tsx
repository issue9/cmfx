// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, JSX, mergeProps } from 'solid-js';

import { AvailableEnumType, joinClass } from '@components/base';
import { FieldBaseProps } from '@components/form/field';
import styles from './style.module.css';

export interface Props<T extends AvailableEnumType = string> extends Omit<FieldBaseProps, 'layout' | 'hasHelp'> {
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
	 * 圆角
	 *
	 * @reactive
	 */
	rounded?: boolean;

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
export function Radio<T extends AvailableEnumType = string>(props: Props<T>): JSX.Element {
	props = mergeProps({ tabindex: 0 } as Props<T>, props);

	const cls = createMemo(() => {
		return joinClass(
			props.palette,
			props.block ? styles.block : '',
			props.rounded ? styles.rounded : '',
			styles.radio,
			props.class,
		);
	});

	return (
		<label title={props.title} class={cls()} style={props.style} tabindex={props.block ? props.tabindex : -1}>
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
			/>
			{props.label}
		</label>
	);
}
