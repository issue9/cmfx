// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { classList, joinClass, style2String, type ThemeProps } from '@cmfx/themes';
import { createEffect, createSignal, type JSX, mergeProps, onCleanup, onMount, type ParentProps } from 'solid-js';

import type { BaseRef, RefProps, ValueProps } from '@components/base';
import { type FormDataProps, type FormFieldContext, useField } from '@components/form/field';
import { useForm } from '@components/form/form';
import styles from './style.module.css';

export interface FormPopoverRef extends BaseRef<HTMLDivElement> {
	/**
	 * 弹出面板
	 */
	showPopover(): void;

	/**
	 * 隐藏面板
	 */
	hidePopover(): void;

	/**
	 * 切换面板的显示状态
	 */
	togglePopover(): void;

	/**
	 * 触发弹出面板的元素
	 */
	activator(): HTMLDivElement;

	/**
	 * 弹出面板的元素
	 */
	popover(): HTMLElement;
}

export const formPopoverTypes = ['click', 'hover'] as const;

export type FormPopoverType = (typeof formPopoverTypes)[number];

export interface FormPopoverProps<T>
	extends ThemeProps,
		ParentProps,
		ValueProps<T>,
		FormDataProps,
		RefProps<FormPopoverRef> {
	/**
	 * 指定弹出对话框的方式
	 *
	 * @defaultValue 'click'
	 * @remarks
	 * - `click`: 点击显示；
	 * - `hover`: 悬停显示；
	 */
	readonly type?: FormPopoverType;

	/**
	 * 获取弹出面板实例
	 */
	readonly popover: () => HTMLElement;

	/**
	 * 作用在触发元素上的样式
	 *
	 * @reactive
	 */
	activatorClass?: string;

	/**
	 * 触发元素的内容
	 */
	readonly activator: (f: FormFieldContext<T>) => JSX.Element;
}

/**
 * 将一个能按受 {@link ValueProps} 的表单元素改装成弹出元素的样式
 *
 * @remarks
 * 大部分支持 `popover` 属性的表单项组件都是通过使用此组件实现支持的
 */
export function Popover<T>(props: FormPopoverProps<T>): JSX.Element {
	let activatorRef: HTMLDivElement;

	const field = useField(props, true);

	const form = useForm();
	props = mergeProps({ tabindex: 0, type: 'click' } as FormPopoverProps<T>, form, props);

	const show = () => {
		props.popover().showPopover();

		const anchor = activatorRef.getBoundingClientRect();
		adjustPopoverPosition(props.popover(), anchor, 0, 'bottom', 'start');
	};
	const hide = () => props.popover().hidePopover();
	const toggle = () => props.popover().togglePopover();

	const [hover, setHover] = createSignal(false);
	const setHoverTrue = () => setHover(true);
	const setHoverFalse = () => setHover(false);

	let label: HTMLLabelElement | undefined | null;

	onMount(() => {
		props.popover().popover = 'auto';
		props.popover().classList.add(styles.popover);

		label = field.fieldRef?.root().querySelector(`label[for="${field.id}"]`);

		if (label) {
			if (props.type === 'click') {
				label.addEventListener('click', show);
			} else {
				label.addEventListener('mouseenter', show);
				label.addEventListener('mouseleave', hide);
			}
		}

		if (props.type === 'hover') {
			props.popover().addEventListener('mouseenter', setHoverTrue);
			props.popover().addEventListener('mouseleave', setHoverFalse);

			createEffect(() => {
				if (hover()) {
					show();
				} else {
					hide();
				}
			});
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

		if (props.type === 'hover') {
			props.popover().removeEventListener('mouseenter', setHoverTrue);
			props.popover().removeEventListener('mouseleave', setHoverFalse);
		}
	});

	return (
		<div
			class={joinClass(props.palette, field.class, props.class)}
			style={style2String(field.style, props.style)}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
						showPopover: show,
						hidePopover: hide,
						togglePopover: toggle,
						activator: () => activatorRef,
						popover: () => props.popover(),
					});
				}
			}}
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static */}
			<div
				aria-haspopup
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
						setHover(true);
					}
				}}
				onmouseleave={() => {
					if (props.type === 'hover') {
						setHover(false);
					}
				}}
				style={props.style}
			>
				{props.activator(field)}
			</div>
			{props.children}
		</div>
	);
}
