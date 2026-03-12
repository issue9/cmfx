// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, Show } from 'solid-js';

import { type BaseProps, joinClass, type RefProps } from '@components/base';
import { Counter } from '@components/counter';
import styles from './style.module.css';

export interface Ref {
	root(): HTMLDivElement;
}

export interface Props extends BaseProps, RefProps<Ref> {
	/**
	 * 显示的标题
	 *
	 * @reactive
	 */
	label: JSX.Element;

	/**
	 * 显示的值
	 *
	 * @reactive
	 */
	value: number;

	/**
	 * {@link value} 的显示方式
	 */
	formatter?: Counter.RootProps['formatter'];

	/**
	 * 图标
	 *
	 * @reactive
	 */
	icon?: JSX.Element;
}

/**
 * 提供显示一组统计数据
 */
export function Root(props: Props): JSX.Element {
	return (
		<div
			class={joinClass(props.palette, styles.statistic, props.class)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({ root: () => el });
				}
			}}
		>
			<div class={styles.label}>{props.label}</div>
			<div class={styles.content}>
				<Show when={props.icon}>
					{c => {
						return c();
					}}
				</Show>
				<Counter.Root value={props.value} formatter={props.formatter} />
			</div>
		</div>
	);
}
