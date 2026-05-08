// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, createUniqueId, type JSX, mergeProps, Show, splitProps, untrack } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { type Week, WeekPanel } from '@components/datetime';
import type { WeekValueType } from '@components/datetime/dateview';
import { Form } from '@components/form';
import type { Props as PickerProps } from './date';
import styles from './style.module.css';
import { togglePop } from './utils';

export type Ref = BaseRef<HTMLDivElement>;

export interface Props
	extends Omit<PickerProps, 'value' | 'onChange' | 'accentPalette' | 'time' | 'ref'>,
		RefProps<Ref> {
	value: WeekValueType | undefined;
	onChange: (val: WeekValueType | undefined) => void;
}

/**
 * 周数选择组件
 */
export function Root(props: Props): JSX.Element {
	const field = Form.useField<WeekValueType>() ?? Form.buildFakeFieldContext(props.value);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0, weekBase: 0 as Week }, form, props);

	const [panelProps, _] = splitProps(props, [
		'weekBase',
		'value',
		'onChange',
		'weekend',
		'disabled',
		'readonly',
		'palette',
		'min',
		'max',
	]);

	let panelRef: HTMLElement;
	let anchorRef: HTMLElement;

	const [hover, setHover] = createSignal(false);

	const change = (val?: WeekValueType) => {
		field.setValue(val);
		panelRef.hidePopover();
	};

	const format = (val: WeekValueType) => {
		return val ? `${val[0]}-${val[1]}` : '';
	};

	const id = createUniqueId();
	return (
		<>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: 正常需求 */}
			<div
				ref={el => (anchorRef = el)}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => togglePop(anchorRef, panelRef)}
				class={joinClass(undefined, styles.container, props.rounded ? styles.rounded : undefined)}
				aria-haspopup
			>
				<input
					id={id}
					readOnly
					disabled={props.disabled}
					placeholder={props.placeholder}
					class={joinClass(undefined, styles.input, styles.range)}
					value={format(field.getValue()!)}
				/>

				<Show when={hover() && field.getValue()} fallback={<IconExpandAll class="shrink-0" />}>
					<IconClose
						class="shrink-0"
						onClick={(e: MouseEvent) => {
							e.stopPropagation();
							field.setValue(undefined);
						}}
					/>
				</Show>
			</div>

			<WeekPanel.Root
				{...panelProps}
				ref={el => (panelRef = el.root())}
				popover="auto"
				disabled={props.disabled}
				aria-haspopup
				value={untrack(field.getValue)}
				onChange={change}
			/>
		</>
	);
}
