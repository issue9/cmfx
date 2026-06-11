// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, Show } from 'solid-js';

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@components/base';
import { Counter } from '@components/counter';
import styles from './style.module.css';

export type StatisticRef = BaseRef<HTMLDivElement>;

export interface StatisticProps extends BaseProps, RefProps<StatisticRef> {
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
	formatter?: Counter.Props['formatter'];

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
export function Statistic(props: StatisticProps): JSX.Element {
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
				<Counter value={props.value} formatter={props.formatter} />
			</div>
		</div>
	);
}
