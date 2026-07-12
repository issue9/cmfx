// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { classList, style2String, type ThemeProps } from '@cmfx/themes';
import { createMemo, type JSX, mergeProps, type ParentProps } from 'solid-js';

import type { BaseRef, Layout, RefProps } from '@components/base';
import styles from './style.module.css';

export type DividerRef = BaseRef<HTMLDivElement>;

export type DividerProps = ParentProps<
	{
		/**
		 * 如果存在文字，表示文字的位置，否则该值无意义。
		 *
		 * @reactive
		 * @defaultValue 'start'
		 */
		pos?: 'start' | 'center' | 'end';

		/**
		 * 组件布局方向
		 *
		 * @reactive
		 */
		layout?: Layout;

		/**
		 * 交叉轴上的留白
		 *
		 * @remarks 语法与 CSS 中的 padding-block 和 padding-inline 相同。可以用一个值或是两个值：
		 *  - padding: 10px；
		 *  - padding: 10px 10px；
		 *  - padding: 5% 10%；
		 *
		 * @reactive
		 */
		padding?: string;
	} & ThemeProps &
		RefProps<DividerRef>
>;

const presetProps: Readonly<DividerProps> = {
	pos: 'start',
	layout: 'horizontal',
};

/**
 * 分割线
 */
export function Divider(props: DividerProps): JSX.Element {
	props = mergeProps(presetProps, props);

	const style = createMemo(() => {
		const s = { [props.layout === 'horizontal' ? 'padding-block' : 'padding-inline']: props.padding };
		return style2String(s, props.style);
	});

	return (
		<div
			ref={el => {
				if (props.ref) props.ref({ root: () => el });
			}}
			style={style()}
			class={classList(
				props.palette,
				{
					[styles.vertical]: props.layout !== 'horizontal',
					[styles[`pos-${props.children ? props.pos : 'none'}`]]: true,
					[styles.divider]: true,
				},
				props.class,
			)}
		>
			{props.children}
		</div>
	);
}
