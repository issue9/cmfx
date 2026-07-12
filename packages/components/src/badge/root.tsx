// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import { createMemo, type JSX, mergeProps, type ParentProps } from 'solid-js';

import type { BaseRef, RefProps } from '@components/base';
import styles from './style.module.css';

/**
 * 组件的四个角
 */
export const badgeCorners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

export type BadgeCorner = (typeof badgeCorners)[number];

export type BadgeRef = BaseRef<HTMLDivElement>;

export interface BadgeProps extends ThemeProps, ParentProps, RefProps<BadgeRef> {
	/**
	 * 位置
	 *
	 * @reactive
	 * @defaultValue 'top-right'
	 */
	pos?: BadgeCorner;

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

const presetProps: Readonly<Partial<BadgeProps>> = {
	pos: 'top-right',
};

/**
 * 微标组件
 */
export function Badge(props: BadgeProps) {
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
