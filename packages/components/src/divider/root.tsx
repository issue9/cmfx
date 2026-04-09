// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, type JSX, mergeProps, type ParentProps } from 'solid-js';

import { type BaseProps, type BaseRef, classList, type Layout, type RefProps, style2String } from '@components/base';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

export type Props = ParentProps<
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
	} & BaseProps &
		RefProps<Ref>
>;

const presetProps: Readonly<Props> = {
	pos: 'start',
	layout: 'horizontal',
};

/**
 * 分割线
 */
export function Root(props: Props): JSX.Element {
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
