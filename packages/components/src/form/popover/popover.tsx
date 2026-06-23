// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { type JSX, mergeProps, onCleanup, onMount } from 'solid-js';

import { type BaseProps, type BaseRef, classList, joinClass, type RefProps } from '@components/base';
import { ContextNotFoundError } from '@components/context';
import { type FormDataProps, type FormFieldContext, useField } from '@components/form/field';
import { useForm } from '@components/form/form';
import styles from './style.module.css';

export interface FormPopoverRef extends BaseRef<HTMLDivElement> {
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

export interface FormPopoverProps extends BaseProps, FormDataProps, RefProps<FormPopoverRef> {
	/**
	 * 指定弹出对话框的方式
	 *
	 * @defaultValue 'click'
	 * @remarks
	 * - `click`: 点击显示；
	 * - `hover`: 悬停显示；
	 */
	readonly type?: 'click' | 'hover';

	/**
	 * 指定弹出面板实例
	 */
	readonly popover: HTMLElement;

	/**
	 * 作用在显示元素上的样式
	 *
	 * @reactive
	 */
	activatorClass?: string;

	/**
	 * 格式化显示值的函数
	 */
	readonly formatter: (f: FormFieldContext<unknown>) => JSX.Element;
}

export function Popover(props: FormPopoverProps): JSX.Element {
	let activatorRef: HTMLElement;

	const field = useField();
	if (!field) {
		throw new ContextNotFoundError('fieldContext');
	}

	const form = useForm();
	props = mergeProps({ tabindex: 0, type: 'click' } as FormPopoverProps, form, props);

	const show = () => {
		props.popover.showPopover();

		const anchor = activatorRef.getBoundingClientRect();
		adjustPopoverPosition(props.popover, anchor, 0, 'bottom', 'start');
	};
	const hide = () => props.popover.hidePopover();
	const toggle = () => props.popover.togglePopover();

	// 注册 label 的事件
	const label = document.getElementById(field.id());
	onMount(() => {
		if (label) {
			if (props.type === 'click') {
				label.addEventListener('click', show);
			} else {
				label.addEventListener('mouseenter', show);
				label.addEventListener('mouseleave', hide);
			}
		}
	});

	onCleanup(() => {
		if (label) {
			if (props.type === 'click') {
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
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static */}
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
					if (props.type === 'click') {
						show();
					}
				}}
				onmouseenter={() => {
					if (props.type === 'hover') {
						show();
					}
				}}
				onmouseleave={() => {
					if (props.type === 'hover') {
						hide();
					}
				}}
				style={props.style}
			/>
			{props.formatter(field)}
		</div>
	);
}
