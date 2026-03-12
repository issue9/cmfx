// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, JSX, mergeProps, ParentProps } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@components/base';
import styles from './style.module.css';

/**
 * 组件的四个角
 */
export const corners = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Corner = (typeof corners)[number];

export interface Ref {
	root(): HTMLDivElement;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 位置
	 *
	 * @reactive
	 * @defaultValue 'topright'
	 */
	pos?: Corner;

	/**
	 * 微标是否为圆形
	 *
	 * @reactive
	 */
	rounded?: boolean;

	/**
	 * 角上的内容
	 *
	 * @reactive
	 */
	content?: JSX.Element;
}

const presetProps: Readonly<Partial<Props>> = {
	pos: 'topright',
};

/**
 * 微标组件
 */
export function Root(props: Props) {
	props = mergeProps(presetProps, props);
	const cls = createMemo(() => {
		return joinClass(props.palette, props.rounded ? 'rounded-full' : '', styles[props.pos!], styles.point, props.class);
	});

	return (
		<div
			class={styles.badge}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
					});
				}
			}}
		>
			{props.children}
			<span class={cls()} style={props.style}>
				{props.content}
			</span>
		</div>
	);
}
