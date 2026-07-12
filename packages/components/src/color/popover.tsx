// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass } from '@cmfx/themes';
import type { JSX, ParentProps } from 'solid-js';
import { createSignal, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import type { RefProps } from '@components/base';
import { Form } from '@components/form';
import { type Base, Panel, type PanelRef } from './panel';
import styles from './style.module.css';

export type PopoverRef = Form.PopoverRef;

export interface PopoverProps extends Base, ParentProps, RefProps<PopoverRef> {
	placeholder?: string;

	readonly popover: Form.PopoverType;

	/**
	 * 是否将文本的字体颜色改为当前的颜色值
	 *
	 * @reactive
	 */
	coloring?: boolean;

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
	let panelRef!: PanelRef;
	let rootRef!: PopoverRef;

	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const [panelProps, _] = splitProps(props, [
		'wcag',
		'spaces',
		'value',
		'onChange',
		'disabled',
		'readonly',
		'tabindex',
	]);

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

	return (
		<Form.Popover
			value={props.value}
			onChange={props.onChange}
			popover={() => panelRef.root()}
			activatorClass={joinClass(undefined, props.activatorClass, styles.activator)}
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
							value={f.getValue() ?? ''}
							style={props.coloring ? { color: f.getValue() } : undefined}
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
			<Panel {...panelProps} ref={el => (panelRef = el)} />
		</Form.Popover>
	);
}
