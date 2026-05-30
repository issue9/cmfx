// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { useLocale } from '@components/context';
import { Form } from '@components/form';
import type { Base, PanelRef } from './panel';
import { Panel } from './panel';
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

	/**
	 * 指定弹出对话框的方式
	 *
	 * @remarks
	 * - `click`: 点击显示；
	 * - `hover`: 悬停显示；
	 */
	readonly popover: 'click' | 'hover';

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

function togglePop(anchor: Element, popElem: HTMLElement): boolean {
	const ab = anchor.getBoundingClientRect();
	const ret = popElem.togglePopover();
	adjustPopoverPosition(popElem, ab, 2);
	return ret;
}

export function Popover(props: PopoverProps): JSX.Element {
	const l = useLocale();

	const field = Form.useField(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);
	const [, p] = splitProps(props, ['ref', 'rounded', 'activatorClass', 'popover', 'placeholder']);

	const [hover, setHover] = createSignal(false);

	let panelRef: PanelRef;
	let anchorRef: HTMLElement;

	const formatter = createMemo(
		() =>
			new Intl.DateTimeFormat(l.locale, {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			}),
	);

	return (
		<>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: Mouse 事件上是为了达到 label 效果 */}
			<div
				ref={el => (anchorRef = el)}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onclick={() => togglePop(anchorRef, panelRef.root())}
				class={joinClass(props.palette, styles['activator-container'], props.rounded ? styles.rounded : '')}
				style={props.style}
				aria-haspopup
			>
				<input
					class={styles.input}
					tabIndex={props.tabindex}
					disabled={props.disabled}
					readOnly
					placeholder={props.placeholder}
					value={field.getValue() ? formatter().format(field.getValue()) : ''}
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

			<Panel
				ref={el => {
					panelRef = el;
					el.root().popover = 'auto';
				}}
				{...p}
			/>
		</>
	);
}
