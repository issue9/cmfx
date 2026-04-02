// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, type ParentProps, Show, splitProps, type ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@components/base';
import styles from './style.module.css';

export type Ref<T extends keyof HTMLElementTagNameMap = 'div'> = BaseRef<
	T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement
>;

export type Props<T extends keyof HTMLElementTagNameMap = 'div'> = ParentProps &
	BaseProps &
	RefProps<Ref<T>> & {
		/**
		 * 自定义标签
		 *
		 * @defaultValue 'div'
		 */
		tag?: T;

		/**
		 * 加载状态
		 *
		 * @reactive
		 */
		spinning?: boolean;

		/**
		 * 在加载状态下的指示器
		 *
		 * @reactive
		 */
		indicator?: JSX.Element;

		/**
		 * 遮罩层的样式
		 *
		 * @remarks
		 * 默认情况下，遮罩层是一个透明全覆盖的元素。此属性可以修改该元素的样式。
		 *
		 * @reactive
		 */
		overlayClass?: string;
	};

/**
 * 加载指示组件
 *
 * @remarks
 * 该组件可以作为任何具有加载状态的组件的容器。
 */
export function Root<T extends keyof HTMLElementTagNameMap = 'div'>(props: Props<T>) {
	const [, p] = splitProps(props, [
		'class',
		'style',
		'palette',
		'ref',
		'tag',
		'spinning',
		'indicator',
		'overlayClass',
		'children',
	]);
	const tag = props.tag ?? ('div' as ValidComponent);

	return (
		<Dynamic
			{...p}
			component={tag}
			aria-busy={props.spinning ? true : undefined}
			class={joinClass(props.palette, styles.spin, props.class)}
			style={props.style}
			ref={(el: ReturnType<Ref<T>['root']>) => {
				if (!props.ref) {
					return;
				}
				props.ref({
					root() {
						return el;
					},
				});
			}}
		>
			{props.children}
			<Show when={props.spinning}>
				<div class={joinClass(undefined, styles.indicator, props.overlayClass)} role="status" aria-live="polite">
					{props.indicator}
				</div>
			</Show>
		</Dynamic>
	);
}
