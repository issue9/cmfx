// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@components/base';
import { Label } from '@components/label';
import styles from './style.module.css';

export interface Ref {
	root: () => HTMLDivElement;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 图标
	 *
	 * @reactive
	 */
	icon?: JSX.Element;

	/**
	 * 标题
	 *
	 * @reactive
	 */
	title?: string;
}

/**
 * 一长段内容的描述信息，可带一个标题。
 */
export function Root(props: Props): JSX.Element {
	return (
		<div
			class={joinClass(props.palette, styles.description, props.class)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		>
			<Show when={props.icon || props.title}>
				<Label.Root icon={props.icon}>{props.title}</Label.Root>
			</Show>
			<div class={styles.desc}>{props.children}</div>
		</div>
	);
}
