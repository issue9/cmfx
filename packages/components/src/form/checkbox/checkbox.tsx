// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, JSX, mergeProps } from 'solid-js';

import { joinClass, RefProps } from '@components/base';
import { FieldBaseProps } from '@components/form/field';
import styles from './style.module.css';

export interface Ref {
	/**
	 * 组件的根元素
	 */
	root(): HTMLLabelElement;

	/**
	 * 组件的 input 元素
	 */
	input(): HTMLInputElement;
}

export interface Props extends Omit<FieldBaseProps, 'layout' | 'hasHelp'>, RefProps<Ref> {
	/**
	 * 设置为不确定状态，只负责样式控制。
	 *
	 * @reactive
	 */
	indeterminate?: boolean;

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
	 * 复选框的状态，true 为选中，false 为未选中。
	 *
	 * @reactive
	 */
	checked?: boolean;

	onChange?: (v?: boolean) => void;
}

/**
 * 带文本提示的复选框
 */
export function Checkbox(props: Props): JSX.Element {
	props = mergeProps({ tabindex: 0 } as Props, props);
	let inputRef: HTMLInputElement;
	let rootRef: HTMLLabelElement;

	createEffect(() => {
		inputRef.indeterminate = !!props.indeterminate;
	});

	const cls = createMemo(() => {
		return joinClass(
			props.palette,
			props.block ? styles.block : '',
			props.rounded ? styles.rounded : '',
			styles.checkbox,
			props.class,
		);
	});

	createEffect(() => {
		// 监视 props.checked
		inputRef.checked = props.checked ? true : false;
	});

	return (
		<label
			role="checkbox"
			title={props.title}
			class={cls()}
			style={props.style}
			tabindex={props.block ? props.tabindex : -1}
			ref={el => (rootRef = el)}
			aria-checked={props.checked}
			aria-readonly={props.readonly}
			aria-disabled={props.disabled}
		>
			<input
				type="checkbox"
				disabled={props.disabled}
				aria-hidden={props.block}
				checked={props.checked}
				ref={el => {
					inputRef = el;
					if (props.ref) {
						props.ref({
							root() {
								return rootRef;
							},
							input() {
								return el;
							},
						});
					}
				}}
				class={joinClass(undefined, props.rounded ? styles.rounded : '')}
				onClick={e => {
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
