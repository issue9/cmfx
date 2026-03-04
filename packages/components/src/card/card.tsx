// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { BaseProps, joinClass, RefProps } from '@components/base';
import styles from './style.module.css';

export interface Ref {
	root(): HTMLDivElement;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 卡片的标题部分
	 *
	 * @reactive
	 */
	header?: JSX.Element;

	/**
	 * 为标题容器追加新的 CSS 样式类
	 *
	 * @reactive
	 */
	headerClass?: string;

	/**
	 * 卡片的页脚部分
	 *
	 * @reactive
	 */
	footer?: JSX.Element;

	/**
	 * 为页脚容器追加新的 CSS 样式类
	 *
	 * @reactive
	 */
	footerClass?: string;

	/**
	 * 为内容容器追加新的 CSS 样式类
	 *
	 * @reactive
	 */
	mainClass?: string;
}

/**
 * 简单的卡片组件
 */
export function Card(props: Props): JSX.Element {
	return (
		<div
			class={joinClass(props.palette, styles.card, props.class)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
					});
				}
			}}
		>
			<Show when={props.header}>
				{c => <header class={joinClass(undefined, styles.header, props.headerClass)}>{c()}</header>}
			</Show>

			<main class={joinClass(undefined, styles.main, props.mainClass)}>{props.children}</main>

			<Show when={props.footer}>
				{c => <footer class={joinClass(undefined, styles.footer, props.footerClass)}>{c()}</footer>}
			</Show>
		</div>
	);
}
