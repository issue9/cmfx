// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type BaseRef, joinClass, type RefProps, type ThemeProps } from '@cmfx/cdk';
import { adjustPopoverPosition, type PopoverPosition, pointInElement } from '@cmfx/core';
import { type JSX, mergeProps, type ParentProps } from 'solid-js';

import { useOptions } from '@components/context';
import styles from './style.module.css';

export interface TooltipRef extends BaseRef<HTMLDivElement> {
	/**
	 * 显示提示框
	 */
	show(): void;

	/**
	 * 隐藏提示内容
	 */
	hide(): void;

	/**
	 * 切换提示内容的显示状态
	 */
	toggle(): void;
}

/**
 * Tooltip 组件的属性
 */
export interface TooltipProps extends ThemeProps, RefProps<TooltipRef>, ParentProps {
	/**
	 * 停留时间
	 *
	 * @defaultValue {@link ../context#Options.stays}
	 * @reactive
	 */
	duration?: number;

	/**
	 * 显示位置
	 *
	 * @defaultValue 'top'
	 * @reactive
	 */
	pos?: PopoverPosition;

	/**
	 * 提示内容
	 *
	 * @reactive
	 */
	tip: JSX.Element;

	/**
	 * 触发方式
	 *
	 * @defaultValue 'hover'
	 * @reactive
	 */
	trigger?: 'click' | 'hover';
}

/**
 * 小型的弹出提示框
 */
export function Tooltip(props: TooltipProps): JSX.Element {
	const [opt] = useOptions();
	props = mergeProps(
		{
			duration: opt.getStays(),
			pos: 'top',
			trigger: 'hover',
		} satisfies Partial<TooltipProps>,
		props,
	);

	let rootRef: HTMLDivElement;
	let triggerRef: HTMLDivElement;

	const hide = () => rootRef.hidePopover();
	const toggle = () => rootRef.togglePopover();
	const show = () => {
		rootRef.showPopover();
		adjustPopoverPosition(rootRef, triggerRef.getBoundingClientRect(), 4, props.pos, 'center');

		if (props.duration! > 0) {
			setTimeout(hide, props.duration);
		}
	};

	return (
		<>
			<div
				class={joinClass(props.palette, styles.tooltip, props.class)}
				style={props.style}
				popover="auto"
				ref={el => {
					rootRef = el;
					props.ref?.({
						show,
						hide,
						toggle,
						root: () => el,
					});
				}}
			>
				{props.tip}
			</div>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: 触发器的容器 */}
			<div
				ref={el => (triggerRef = el)}
				onmouseenter={() => {
					if (props.trigger !== 'hover' || !rootRef) {
						return;
					}
					show();
				}}
				onmouseleave={e => {
					if (props.trigger !== 'hover' || !rootRef) {
						return;
					}

					if (!pointInElement(e.clientX, e.clientY, rootRef)) {
						hide();
					}
				}}
				onclick={e => {
					if (props.trigger !== 'click' || !rootRef) {
						return;
					}

					e.preventDefault();
					e.stopPropagation();
					show();
				}}
			>
				{props.children}
			</div>
		</>
	);
}
