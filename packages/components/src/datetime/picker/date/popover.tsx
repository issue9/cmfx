// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import { createMemo, createSignal, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass, type RefProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import type { Week } from '@components/datetime';
import { Form } from '@components/form';
import { type Base, Panel } from './panel';
import styles from './style.module.css';

export type PopoverRef = Form.PopoverRef;

export interface PopoverProps extends Base, RefProps<PopoverRef> {
	placeholder?: string;

	/**
	 * 是否圆角
	 *
	 * @reactive
	 */
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
	const field = Form.useField<Date>(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0, weekBase: 0 as Week }, form, props);

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
			class={props.class}
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
							class={styles.input}
							tabIndex={props.tabindex}
							disabled={props.disabled}
							readOnly
							placeholder={props.placeholder}
							value={formater()(f.getValue())}
						/>
						<Show when={hover() && f.getValue()} fallback={<IconExpandAll />}>
							<IconClose
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
			<fieldset popover="auto" disabled={props.disabled} ref={el => (panelRef = el)} class={styles.panel} aria-haspopup>
				<Panel
					class={styles['dt-panel']}
					{...panelProps}
					value={field.getValue()}
					onChange={val => field.setValue(val)}
				/>

				<div class={styles.actions}>
					<div class={styles.left}>
						<Button
							kind="flat"
							class="px-1 py-0"
							onclick={() => {
								const now = new Date();
								if ((props.min && props.min > now) || (props.max && props.max < now)) {
									return;
								}
								field.setValue(now);
								panelRef.hidePopover();
							}}
						>
							{l.t(props.time ? '_c.date.now' : '_c.date.today')}
						</Button>
					</div>

					<div class={styles.right}>
						<Button
							kind="flat"
							class="px-1 py-0"
							onclick={() => {
								field.setValue(undefined);
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
				</div>
			</fieldset>
		</Form.Popover>
	);
}
