// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import { createSignal, For, type JSX, mergeProps } from 'solid-js';

import type { BaseRef, RefProps } from '@components/base';
import styles from './style.module.css';

export interface NavRef extends BaseRef<HTMLElement> {
	/**
	 * 重新计算导航内容
	 */
	refresh(): void;
}

export interface NavProps extends ThemeProps, RefProps<NavRef> {
	/**
	 * 用于生成目录的元素
	 *
	 * @remarks
	 * {@link query} 查询只应用在此元素之上。
	 */
	readonly target: HTMLElement;

	/**
	 * 用于查询目录项的 css selector 表达式
	 *
	 * @defaultValue `h1,h2,h3,h4,h5,h6`
	 * @reactive
	 */
	query?: string;

	/**
	 * 最小的标题数量
	 *
	 * @defaultValue 1
	 * @reactive
	 */
	min?: number;
}

const queryString = 'h1,h2,h3,h4,h5,h6';

/**
 * 根据 h1-h6 元素生成导航内容
 */
export function Nav(props: NavProps): JSX.Element {
	props = mergeProps({ query: queryString, min: 1 }, props);

	const list = props.target.querySelectorAll(props.query!);
	const [headings, setHeadings] = createSignal(list.length >= props.min! ? list : []);

	const refresh = (): void => {
		const list = props.target.querySelectorAll(props.query!);
		setHeadings(list.length >= props.min! ? list : []);
	};

	return (
		<nav
			class={joinClass(props.palette, styles.nav, props.class)}
			style={props.style}
			ref={el => {
				props.ref?.({
					root: () => el,
					refresh: () => refresh(),
				});
			}}
		>
			<For each={Array.from(headings())}>
				{h => (
					<p
						class={styles[h.tagName.toLowerCase()]}
						onclick={() => {
							h.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
						}}
					>
						{h.textContent}
					</p>
				)}
			</For>
		</nav>
	);
}
