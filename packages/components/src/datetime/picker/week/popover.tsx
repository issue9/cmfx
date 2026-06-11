// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createSignal, createUniqueId, type JSX, mergeProps, Show, splitProps, untrack } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseRef, joinClass, type RefProps, style2String } from '@components/base';
import type { Week } from '@components/datetime/utils';
import type { MonthView } from '@components/datetime/view/month';
import { Form } from '@components/form';
import { type Base, Panel } from './panel';
import styles from './style.module.css';

export interface PopoverRef extends BaseRef<HTMLDivElement> {
	/**
	 * 显示颜色拾取面板
	 */
	showPopover(): void;

	/**
	 * 隐藏颜色拾取面板
	 */
	hidePopover(): void;

	/**
	 * 切换颜色拾取面板的显示状态
	 */
	togglePopover(): void;
}

export interface PopoverProps extends Base, RefProps<PopoverRef> {
	placeholder?: string;
	rounded?: boolean;
	readonly popover: 'click' | 'hover';
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
	let anchorRef: HTMLElement;

	const [hover, setHover] = createSignal(false);

	field.onChange(() => {
		panelRef.hidePopover();
	});

	const format = (val: MonthView.WeekValueType) => {
		return val ? `${val[0]}-${val[1]}` : '';
	};

	const show = () => {
		panelRef.showPopover();
		const ab = anchorRef.getBoundingClientRect();
		adjustPopoverPosition(panelRef, ab, 2);
	};
	const hide = () => panelRef.hidePopover();
	const toggle = () => panelRef.togglePopover();

	const id = createUniqueId();
	return (
		<div
			class={joinClass(props.palette, props.class)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
						showPopover: show,
						hidePopover: hide,
						togglePopover: toggle,
					});
				}
			}}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: 正常需求 */}
			<div
				ref={el => (anchorRef = el)}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => {
					if (props.popover === 'click') {
						show();
					}
				}}
				onmouseenter={() => {
					if (props.popover === 'hover') {
						show();
					}
				}}
				onmouseleave={() => {
					if (props.popover === 'hover') {
						hide();
					}
				}}
				class={joinClass(undefined, field.class, styles.container, props.rounded ? styles.rounded : undefined)}
				style={style2String(field.style, props.style)}
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

			<Panel
				{...panelProps}
				ref={el => {
					panelRef = el.root();
					el.root().popover = 'auto';
				}}
				disabled={props.disabled}
				value={untrack(field.getValue)}
			/>
		</div>
	);
}
