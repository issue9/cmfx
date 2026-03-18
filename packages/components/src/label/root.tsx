// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, mergeProps, type ParentProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@components/base';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLElement>;

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 图标
	 *
	 * @reactive
	 */
	icon?: JSX.Element;

	/**
	 * 标签名
	 *
	 * @defaultValue p
	 */
	tag?: keyof JSX.HTMLElementTags;
}

/**
 * 带图标的标题
 */
export function Root(props: Props): JSX.Element {
	props = mergeProps({ tag: 'p' as Props['tag'] }, props);

	return (
		<Dynamic
			component={props.tag}
			class={joinClass(props.palette, styles.label, props.class)}
			style={props.style}
			ref={(el: HTMLElement) => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		>
			<Show when={props.icon}>
				{c => {
					return c();
				}}
			</Show>
			{props.children}
		</Dynamic>
	);
}
