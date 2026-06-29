// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, type JSX, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { joinClass, type RefProps } from '@components/base';
import { useLocale } from '@components/context';
import { Form } from '@components/form';
import type { Base, PanelRef } from './panel';
import { Panel } from './panel';
import styles from './style.module.css';

export type PopoverRef = Form.PopoverRef;

export interface PopoverProps extends Base, RefProps<PopoverRef> {
	placeholder?: string;

	readonly popover: Form.PopoverType;

	/**
	 * 作用在显示元素上的样式
	 *
	 * @reactive
	 */
	activatorClass?: string;

	/**
	 * 是否圆角
	 *
	 * @reactive
	 */
	rounded?: boolean;
}

export function Popover(props: PopoverProps): JSX.Element {
	const l = useLocale();

	//const field = Form.useField(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);
	const [, panelProps] = splitProps(props, [
		'ref',
		'rounded',
		'activatorClass',
		'popover',
		'placeholder',
		'value',
		'onChange',
	]);

	let panelRef: PanelRef;
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

	const formatter = createMemo(
		() =>
			new Intl.DateTimeFormat(l.locale, {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			}),
	);

	return (
		<Form.Popover
			value={props.value}
			onChange={props.onChange}
			popover={() => panelRef.root()}
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
							class={styles.input}
							tabIndex={props.tabindex}
							disabled={props.disabled}
							readOnly
							placeholder={props.placeholder}
							value={f.getValue() ? formatter().format(f.getValue()) : ''}
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
			<Panel
				ref={el => {
					panelRef = el;
					el.root().popover = 'auto';
				}}
				{...panelProps}
			/>
		</Form.Popover>
	);
}
