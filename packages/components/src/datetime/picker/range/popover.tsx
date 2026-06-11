// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconArrowRight from '~icons/bxs/right-arrow';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import type { Week } from '@components/datetime';
import { Form } from '@components/form';
import { type Base, Panel } from './panel';
import type { DateRangeValueType } from './shortcuts';
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
	rounded?: boolean;

	readonly popover: 'click' | 'hover';

	placeholder?: string;

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
	]);

	let panelRef: HTMLElement;
	let anchorRef: HTMLElement;

	const [hover, setHover] = createSignal(false);

	const formater = createMemo(() => {
		return props.time ? l.datetimeFormat().format : l.dateFormat().format;
	});

	const show = () => {
		panelRef.showPopover();
		const ab = anchorRef.getBoundingClientRect();
		adjustPopoverPosition(panelRef, ab, 2);
	};
	const hide = () => panelRef.hidePopover();
	const toggle = () => panelRef.togglePopover();

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
				style={field.style}
				aria-haspopup
			>
				<input
					id={field.id()}
					readOnly
					disabled={props.disabled}
					placeholder={props.placeholder}
					class={joinClass(undefined, styles.input, styles.range)}
					value={formater()(field.getValue()?.[0])}
				/>
				<div class="shrink-0 px-1">{props.arrowIcon}</div>
				<input
					readOnly
					disabled={props.disabled}
					placeholder={props.placeholder}
					class={joinClass(undefined, styles.input, styles.range)}
					value={formater()(field.getValue()?.[1])}
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

			<fieldset popover="auto" disabled={props.disabled} ref={el => (panelRef = el)} class={styles.panel} aria-haspopup>
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
		</div>
	);
}
