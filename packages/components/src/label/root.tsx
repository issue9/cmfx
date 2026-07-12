// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import { type JSX, mergeProps, type ParentProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { BaseRef, RefProps } from '@components/base';
import styles from './style.module.css';

export type LabelRef = BaseRef<HTMLElement>;

export interface LabelProps extends ThemeProps, ParentProps, RefProps<LabelRef> {
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
export function Label(props: LabelProps): JSX.Element {
	props = mergeProps({ tag: 'p' as LabelProps['tag'] }, props);

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
			<Show when={props.icon}>{c => c()}</Show>
			{props.children}
		</Dynamic>
	);
}
