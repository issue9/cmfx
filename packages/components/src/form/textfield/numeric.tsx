// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createUniqueId, JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';
import IconArrowDown from '~icons/material-symbols/arrow-drop-down';
import IconArrowUp from '~icons/material-symbols/arrow-drop-up';

import { BaseProps, PropsError, RefProps, style2String } from '@components/base';
import { Button } from '@components/button';
import type { Accessor, FieldBaseProps } from '@components/form/field';
import { calcLayoutFieldAreas, Field, FieldHelpArea, fieldArea2Style, useForm } from '@components/form/field';
import { Input, NumberProps, Ref } from '@components/input/input';
import styles from './style.module.css';

export interface Props extends FieldBaseProps, RefProps<Ref> {
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
	 * NOTE: 非响应式属性
	 */
	accessor: Accessor<number | undefined>;

	/**
	 * 键盘的输入模式
	 *
	 * @reactive
	 */
	inputMode?: NumberProps['inputMode'];
}

const presetProps: Partial<Props> = {
	step: 1,
	inputMode: 'decimal',
};

/**
 * 数字输入组件
 */
export default function Numeric(props: Props): JSX.Element {
	const form = useForm(); // Numeric 在 textfield 的外层，所以得保证 useForm 是可用的。
	props = mergeProps(presetProps, form, props);

	if (props.step === 0) {
		throw new PropsError('step', '不能为零');
	}

	const access = props.accessor;

	const step = (v: number) => {
		if (props.readonly || props.disabled) {
			return;
		}

		const n = (access.getValue() ?? 0) + v;
		if (props.min !== undefined && v < 0 && n < props.min) {
			return;
		}
		if (props.max !== undefined && v > 0 && n > props.max) {
			return;
		}

		access.setValue((access.getValue() ?? 0) + v);
		access.setError();
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
			<Button
				kind="flat"
				class={styles['number-spin']}
				disabled={props.disabled || props.readonly}
				onclick={() => step(props.step!)}
				ref={el => {
					el.root().tabIndex = -1;
				}}
			>
				<IconArrowUp />
			</Button>
			<Button
				kind="flat"
				class={styles['number-spin']}
				disabled={props.disabled || props.readonly}
				onclick={() => step(-props.step!)}
				ref={el => {
					el.root().tabIndex = -1;
				}}
			>
				<IconArrowDown />
			</Button>
		</>
	);

	const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));

	const id = createUniqueId();

	let rootRef: HTMLDivElement;

	const Trigger = (p: { style?: BaseProps['style'] }) => {
		let inputRef: Ref;
		createEffect(() => {
			inputRef.root().style = style2String(p.style);
		});

		onMount(() => {
			inputRef.input().addEventListener('wheel', wheel);
		});

		onCleanup(() => {
			inputRef.input().removeEventListener('wheel', wheel);
		});

		return (
			<Input
				type="number"
				id={id}
				prefix={props.prefix}
				suffix={suffix}
				rounded={props.rounded}
				inputMode={props.inputMode}
				tabindex={props.tabindex}
				disabled={props.disabled}
				readonly={props.readonly}
				placeholder={props.placeholder}
				value={props.accessor.getValue()}
				onChange={v => {
					props.accessor.setValue(v);
					props.accessor.setError();
				}}
				ref={el => {
					inputRef = el;
					if (props.ref) {
						props.ref({
							root: () => rootRef,
							input: () => el.input(),
						});
					}
				}}
			/>
		);
	};

	return (
		<Field
			title={props.title}
			ref={el => {
				rootRef = el;
			}}
			palette={props.palette}
			class={props.class}
			style={props.style}
		>
			<Show when={areas().labelArea}>
				{area => (
					<label
						style={{
							...fieldArea2Style(area()),
							width: props.labelWidth,
							'text-align': props.labelAlign,
						}}
						for={id}
					>
						{props.label}
					</label>
				)}
			</Show>

			<Trigger style={fieldArea2Style(areas().inputArea)} />

			<Show when={areas().helpArea}>
				{area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
			</Show>
		</Field>
	);
}
