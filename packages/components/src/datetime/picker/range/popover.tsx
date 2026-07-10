// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass } from '@cmfx/themes';
import { createMemo, createSignal, type JSX, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import type { RefProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import type { Week } from '@components/datetime';
import { Form } from '@components/form';
import { type Base, Panel } from './panel';
import type { DateRangeValueType } from './shortcuts';
import styles from './style.module.css';

export type PopoverRef = Form.PopoverRef;

export interface PopoverProps extends Base, RefProps<PopoverRef> {
	/**
	 * 圆角
	 *
	 * @reactive
	 */
	rounded?: boolean;

	readonly popover: Form.PopoverType;

	/**
	 * 内容占位符
	 *
	 * @reactive
	 */
	placeholder?: string;

	/**
	 * 作用在显示元素上的样式
	 *
	 * @reactive
	 */
	activatorClass?: string;

	/**
	 * 中间的箭头
	 *
	 * @reactive
	 */
	arrowIcon?: JSX.Element;
}

export function Popover(props: PopoverProps): JSX.Element {
	const field = Form.useField<DateRangeValueType>(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0, weekBase: 0 as Week, arrowIcon: <IconArrowRight /> }, form, props);

	const l = useLocale();

	const [panelProps, _] = splitProps(props, [
		'time',
		'weekBase',
		'weekend',
		'disabled',
		'readonly',
		'palette',
		'min',
		'max',
		'shortcuts',
		'value',
		'onChange',
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

	const formater = createMemo(() => {
		return props.time ? l.datetimeFormat().format : l.dateFormat().format;
	});

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
							class={styles.input}
							value={formater()(f.getValue()?.[0])}
						/>
						<div class="shrink-0 px-1">{props.arrowIcon}</div>
						<input
							readOnly
							disabled={props.disabled}
							placeholder={props.placeholder}
							class={styles.input}
							value={formater()(f.getValue()?.[1])}
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
			<fieldset
				popover="auto"
				disabled={props.disabled}
				ref={el => (panelRef = el)}
				class={styles['pop-panel']}
				aria-haspopup
			>
				<Panel class={styles['dt-panel']} {...panelProps} value={field.getValue()} onChange={v => field.setValue(v)} />

				<div class={joinClass(undefined, styles.actions, 'justify-end!')}>
					<Button
						kind="flat"
						class="px-1 py-0"
						onclick={() => {
							field.setValue([undefined, undefined]);
							panelRef.hidePopover();
						}}
					>
						{l.t('_c.date.clear')}
					</Button>

					<Button
						kind="flat"
						class="px-1 py-0"
						onclick={() => {
							field.reset();
							panelRef.hidePopover();
						}}
					>
						{l.t('_c.reset')}
					</Button>
				</div>
			</fieldset>
		</Form.Popover>
	);
}
