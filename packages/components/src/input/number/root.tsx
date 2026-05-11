// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, mergeProps, onCleanup, onMount } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/arrow-drop-down';
import IconArrowUp from '~icons/material-symbols/arrow-drop-up';

import { type BaseProps, PropsError, type RefProps } from '@components/base';
import { Button } from '@components/button';
import { Form } from '@components/form';
import { InputBase } from '@components/input/base';
import styles from './style.module.css';

export type Ref = InputBase.RootRef;

export interface Props extends Form.DataProps<number>, BaseProps, RefProps<Ref> {
	/**
	 * 最小值
	 */
	min?: number;

	/**
	 * 最大值
	 */
	max?: number;

	/**
	 * 步长
	 */
	step?: number;

	/**
	 * 文本框内顶部的内容
	 *
	 * @reactive
	 */
	prefix?: JSX.Element;

	/**
	 * placeholder
	 *
	 * @reactive
	 */
	placeholder?: string;

	/**
	 * 键盘的输入模式
	 *
	 * @reactive
	 */
	inputMode?: InputBase.NumberProps['inputMode'];
}

const presetProps: Partial<Props> = {
	step: 1,
	inputMode: 'decimal',
	tabindex: 0,
} as const;

/**
 * 数字输入组件
 */
export function Root(props: Props): JSX.Element {
	const field = Form.useField<number>(props, true);
	const form = Form.useForm();
	props = mergeProps(presetProps, form, props);

	if (props.step === 0) {
		throw new PropsError('step', '不能为零');
	}

	const step = (v: number) => {
		if (props.readonly || props.disabled) {
			return;
		}

		const n = (field.getValue() ?? 0) + v;
		if (props.min !== undefined && v < 0 && n < props.min) {
			return;
		}
		if (props.max !== undefined && v > 0 && n > props.max) {
			return;
		}

		field.setValue((field.getValue() ?? 0) + v);
		field.setError();
	};

	const wheel = (e: WheelEvent) => {
		if (props.readonly || props.disabled) {
			return;
		}

		e.preventDefault();
		const stepV = props.step ?? 1;
		step(e.deltaY > 0 ? stepV : -stepV);
	};

	const suffix = (
		<>
			<Button.Root
				kind="flat"
				class={styles['number-spin']}
				disabled={props.disabled || props.readonly}
				onclick={() => step(props.step!)}
				ref={el => (el.root().tabIndex = -1)}
			>
				<IconArrowUp />
			</Button.Root>
			<Button.Root
				kind="flat"
				class={styles['number-spin']}
				disabled={props.disabled || props.readonly}
				onclick={() => step(-props.step!)}
				ref={el => (el.root().tabIndex = -1)}
			>
				<IconArrowDown />
			</Button.Root>
		</>
	);

	let inputRef: Ref;

	onMount(() => inputRef.input().addEventListener('wheel', wheel));

	onCleanup(() => inputRef.input().removeEventListener('wheel', wheel));

	return (
		<InputBase.Root
			class={props.class}
			style={props.style}
			palette={props.palette}
			type="number"
			id={field.id}
			prefix={props.prefix}
			suffix={suffix}
			rounded={props.rounded}
			inputMode={props.inputMode}
			tabindex={props.tabindex}
			disabled={props.disabled}
			readonly={props.readonly}
			placeholder={props.placeholder}
			value={field.getValue()}
			onChange={v => {
				field.setValue(v);
				field.setError();
			}}
			ref={el => {
				inputRef = el;
				if (props.ref) {
					props.ref({
						root: () => el.root(),
						input: () => el.input(),
					});
				}
			}}
		/>
	);
}
