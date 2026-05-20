// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, type JSX, mergeProps } from 'solid-js';

import type { BaseProps, BaseRef, RefProps, ValueProps } from '@components/base';
import { joinClass, style2String } from '@components/base';
import { Form } from '@components/form';
import type { InputBase } from '@components/input';
import styles from './style.module.css';

export interface Ref extends BaseRef<HTMLDivElement> {
	/**
	 * 组件中的 textarea 元素
	 */
	textarea(): HTMLTextAreaElement;
}

export interface Props extends BaseProps, Form.DataProps, ValueProps<string>, RefProps<Ref> {
	/**
	 * 最小的字符数量
	 *
	 * @reactive
	 */
	maxLength?: number;

	/**
	 * 最大的字符数量
	 *
	 * @reactive
	 */
	minLength?: number;

	placeholder?: string;

	/**
	 * 指定输入键盘的模式
	 *
	 * @reactive
	 */
	inputMode?: InputBase.TextProps['inputMode'];

	/**
	 * 指定显示字符串统计的格式化方法
	 *
	 * @remarks
	 * 如果为方法，表示采用此方法格式化字符串统计内容并显示在恰当的位置，
	 * 如果为 true，相当于指定了类似以下方法作为格式化方法：
	 * ```ts
	 * (val, max?) => `${val}/${max}`
	 * ```
	 * 如果为 false 或是为空表示不需要展示统计数据。
	 */
	count?: boolean | ((val: number, max?: number) => string);
}

function countFormater(val: number, max?: number): string {
	return max !== undefined ? `${val}/${max}` : val.toString();
}

/**
 * 多行文本框
 *
 * @typeParam T - 文本框内容的类型
 */
export function Root(props: Props): JSX.Element {
	const field = Form.useField(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const [count, setCount] = createSignal('');
	createEffect(() => {
		if (props.count) {
			const formatter = props.count === true ? countFormater : props.count;
			setCount(formatter(field.getValue()?.toString().length ?? 0, props.maxLength));
		} else {
			setCount('');
		}
	});

	let textareaRef: HTMLTextAreaElement;
	let rootRef: HTMLDivElement;

	return (
		<div
			class={joinClass(props.palette, styles.ta, field.class, props.class)}
			style={style2String(field.style, props.style)}
			ref={el => (rootRef = el)}
		>
			<textarea
				id={field.id()}
				inputMode={props.inputMode}
				class={joinClass(undefined, styles.textarea, props.rounded ? styles.rounded : '')}
				tabIndex={props.tabindex}
				disabled={props.disabled}
				readOnly={props.readonly}
				placeholder={props.placeholder}
				value={field.getValue()}
				ref={el => {
					textareaRef = el;

					if (props.ref) {
						props.ref({
							root: () => rootRef,
							textarea: () => textareaRef,
						});
					}
				}}
				onInput={e => {
					field.setValue(e.target.value);
					field.setError();
				}}
			/>

			<span class={styles.count}>{count()}</span>
		</div>
	);
}
