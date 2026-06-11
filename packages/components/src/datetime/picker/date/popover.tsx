// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale } from '@components/context';
import type { Week } from '@components/datetime';
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
			{/** biome-ignore lint/a11y/noStaticElementInteractions: 正常需要 */}
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
				class={joinClass(undefined, styles.container, field.class, props.rounded ? styles.rounded : '')}
				style={field.style}
				aria-haspopup
			>
				<input
					id={field.id()}
					class={styles.input}
					tabIndex={props.tabindex}
					disabled={props.disabled}
					readOnly
					placeholder={props.placeholder}
					value={formater()(field.getValue())}
				/>
				<Show when={hover() && field.getValue()} fallback={<IconExpandAll />}>
					<IconClose
						onClick={(e: MouseEvent) => {
							e.stopPropagation();
							field.setValue(undefined);
						}}
					/>
				</Show>
			</div>

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
		</div>
	);
}
