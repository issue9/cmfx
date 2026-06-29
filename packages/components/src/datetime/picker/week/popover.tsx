// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, type JSX, mergeProps, onCleanup, onMount, Show, splitProps, untrack } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass, type RefProps } from '@components/base';
import type { Week } from '@components/datetime/utils';
import type { MonthView } from '@components/datetime/view/month';
import { Form } from '@components/form';
import { type Base, Panel } from './panel';
import styles from './style.module.css';

export type PopoverRef = Form.PopoverRef;

export interface PopoverProps extends Base, RefProps<PopoverRef> {
	placeholder?: string;
	rounded?: boolean;
	readonly popover: Form.PopoverType;
	/**
	 * 作用在显示元素上的样式
	 *
	 * @reactive
	 */
	activatorClass?: string;
}

export function Popover(props: PopoverProps): JSX.Element {
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0, weekBase: 0 as Week }, form, props);
	const field = Form.useField<MonthView.WeekValueType>(props, true);

	const [panelProps, _] = splitProps(props, [
		'weekBase',
		'value',
		'onChange',
		'weekend',
		'disabled',
		'readonly',
		'min',
		'max',
	]);

	let panelRef: HTMLElement;
	let rootRef!: PopoverRef;

	const [hover, setHover] = createSignal(false);
	const setHoverTrue = () => setHover(true);
	const setHoverFalse = () => setHover(false);
	onMount(() => {
		rootRef.activator().addEventListener('mouseenter', setHoverTrue);
		rootRef.activator().addEventListener('mouseleave', setHoverFalse);
	});
	onCleanup(() => {
		rootRef.activator().removeEventListener('mouseenter', setHoverTrue);
		rootRef.activator().removeEventListener('mouseleave', setHoverFalse);
	});

	field.onChange(() => {
		panelRef.hidePopover();
	});

	const format = (val: MonthView.WeekValueType) => {
		return val ? `${val[0]}-${val[1]}` : '';
	};

	return (
		<Form.Popover
			value={props.value}
			onChange={props.onChange}
			popover={() => panelRef}
			activatorClass={joinClass(undefined, styles.activator, props.activatorClass)}
			type={props.popover}
			rounded={props.rounded}
			readonly={props.readonly}
			disabled={props.disabled}
			palette={props.palette}
			class={joinClass(undefined, styles.popover, props.class)}
			style={props.style}
			ref={el => {
				rootRef = el;
				if (props.ref) {
					props.ref(el);
				}
			}}
			activator={f => {
				return (
					<>
						<input
							id={f.id}
							readOnly
							disabled={props.disabled}
							placeholder={props.placeholder}
							class={joinClass(undefined, styles.input, styles.range)}
							value={format(f.getValue()!)}
						/>

						<Show when={hover() && f.getValue()} fallback={<IconExpandAll class="shrink-0" />}>
							<IconClose
								class="shrink-0"
								onClick={(e: MouseEvent) => {
									e.stopPropagation();
									f.setValue(undefined);
								}}
							/>
						</Show>
					</>
				);
			}}
		>
			<Panel
				{...panelProps}
				ref={el => {
					panelRef = el.root();
					el.root().popover = 'auto';
				}}
				disabled={props.disabled}
				value={untrack(field.getValue)}
			/>
		</Form.Popover>
	);
}
