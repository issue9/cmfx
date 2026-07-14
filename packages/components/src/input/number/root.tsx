// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { PropsError } from '@cmfx/core';
import { joinClass, style2String } from '@cmfx/themes';
import { type JSX, mergeProps, onCleanup, onMount } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/arrow-drop-down';
import IconArrowUp from '~icons/material-symbols/arrow-drop-up';

import type { RefProps } from '@components/base';
import { Button } from '@components/button';
import { Form } from '@components/form';
import { InputBase } from '@components/input/base';
import styles from './style.module.css';

export type InputNumberRef = InputBase.Ref;

export interface InputNumberProps extends Omit<InputBase.NumberProps, 'suffix' | 'type'>, RefProps<InputNumberRef> {
	/**
	 * 最小值
	 */
	readonly min?: number;

	/**
	 * 最大值
	 */
	readonly max?: number;

	/**
	 * 步长
	 */
	readonly step?: number;
}

const presetProps: Partial<InputNumberProps> = {
	step: 1,
	inputMode: 'decimal',
	tabindex: 0,
} as const;

/**
 * 数字输入组件
 */
export function InputNumber(props: InputNumberProps): JSX.Element {
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
		step(e.deltaY > 0 ? -stepV : stepV);
	};

	const suffix = (
		<>
			<Button
				kind="flat"
				class={styles['number-spin']}
				disabled={props.disabled || props.readonly}
				onclick={() => step(props.step!)}
				ref={el => (el.root().tabIndex = -1)}
			>
				<IconArrowUp />
			</Button>
			<Button
				kind="flat"
				class={styles['number-spin']}
				disabled={props.disabled || props.readonly}
				onclick={() => step(-props.step!)}
				ref={el => (el.root().tabIndex = -1)}
			>
				<IconArrowDown />
			</Button>
		</>
	);

	let inputRef: InputNumberRef;

	onMount(() => inputRef.input().addEventListener('wheel', wheel));
	onCleanup(() => inputRef.input().removeEventListener('wheel', wheel));

	return (
		<InputBase
			value={field.getValue()}
			onChange={v => field.setValue(v)}
			class={joinClass(undefined, field.class, props.class)}
			style={style2String(field.style, props.style)}
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
