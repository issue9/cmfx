// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { type JSX, mergeProps, onCleanup, onMount, type ParentProps, splitProps } from 'solid-js';

import { type BaseRef, classList, joinClass, type RefProps } from '@components/base';
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

export interface PopoverProps extends Base, ParentProps, RefProps<PopoverRef> {
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

export function Popover(props: PopoverProps): JSX.Element {
	let panelRef: PanelRef;
	let activatorRef: HTMLElement;

	const field = Form.useField<string>(props, true);
	const form = Form.useForm();
	props = mergeProps({ tabindex: 0 }, form, props);

	const [panelProps, _] = splitProps(props, ['palette', 'wcag', 'spaces']);

	const show = () => {
		panelRef.root().showPopover();

		const anchor = activatorRef.getBoundingClientRect();
		adjustPopoverPosition(panelRef.root(), anchor, 0, 'bottom', 'start');
	};
	const hide = () => panelRef.root().hidePopover();
	const toggle = () => panelRef.root().togglePopover();

	// 注册 label 的事件
	const label = document.getElementById(field.id());
	onMount(() => {
		if (label) {
			if (props.popover === 'click') {
				label.addEventListener('click', show);
			} else {
				label.addEventListener('mouseenter', show);
				label.addEventListener('mouseleave', hide);
			}
		}
	});

	onCleanup(() => {
		if (label) {
			if (props.popover === 'click') {
				label.removeEventListener('click', show);
			} else {
				label.removeEventListener('mouseenter', show);
				label.removeEventListener('mouseleave', hide);
			}
		}
	});

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
			<div
				ref={el => (activatorRef = el)}
				class={classList(
					undefined,
					{
						[styles.activator]: true,
						[styles.rounded]: props.rounded,
						[styles.readonly]: props.readonly,
						[styles.disabled]: props.disabled,
					},
					props.activatorClass,
				)}
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
				style={{
					color: field.getValue(),
					background: props.wcag,
				}}
			>
				{props.children ?? field.getValue()}
			</div>

			<Panel
				{...panelProps}
				onChange={v => field.setValue(v)}
				value={field.getValue()}
				ref={el => {
					panelRef = el;
					el.root().popover = 'auto';
				}}
			/>
		</div>
	);
}
