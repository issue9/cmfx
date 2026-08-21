// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type BaseRef, joinClass, type RefProps, type ThemeProps } from '@cmfx/cdk';
import { type JSX, type ParentProps, Show } from 'solid-js';

import { Label } from '@components/label';
import styles from './style.module.css';

export type DescriptionRef = BaseRef<HTMLDivElement>;

export interface DescriptionProps extends ThemeProps, ParentProps, RefProps<DescriptionRef> {
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
	title?: JSX.Element;
}

/**
 * 一长段内容的描述信息，可带一个标题。
 */
export function Description(props: DescriptionProps): JSX.Element {
	return (
		<div
			class={joinClass(props.palette, styles.description, props.class)}
			style={props.style}
			ref={el => props.ref?.({ root: () => el })}
		>
			<Show when={props.icon || props.title}>
				<Label icon={props.icon}>{props.title}</Label>
			</Show>
			<div class={styles.desc}>{props.children}</div>
		</div>
	);
}
