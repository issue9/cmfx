// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type StyleProps, type ThemeProps } from '@cmfx/themes';
import { A } from '@solidjs/router';
import { type JSX, type ParentProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { BaseRef, RefProps } from '@components/base';
import styles from './style.module.css';

export type AppbarRef = BaseRef<HTMLElement>;

export interface AppbarProps extends ThemeProps, ParentProps, RefProps<AppbarRef> {
	/**
	 * 产品名称显示区域
	 *
	 * @reactive
	 */
	brand?: JSX.Element;

	/**
	 * 为 {@link #brand} 的根元素添加的 CSS 类
	 *
	 * @reactive
	 */
	brandClass?: string;

	/**
	 * 尾部的按钮列表
	 *
	 * @reactive
	 */
	actions?: JSX.Element;

	/**
	 * 为 actions 的根元素添加 CSS 类
	 *
	 * @reactive
	 */
	actionsClass?: string;
}

/**
 * 应用顶部的工具栏
 *
 * @remarks 组件分成了以下几部分：
 * ```
 *  | logo title    children                       actions |
 * ```
 */
export function Appbar(props: AppbarProps): JSX.Element {
	return (
		<header
			role="toolbar"
			class={joinClass(props.palette, styles.appbar, props.class)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
					});
				}
			}}
		>
			<Show when={props.brand}>{c => <div class={joinClass(undefined, props.brandClass)}>{c()}</div>}</Show>

			<Show when={props.children}>{c => <div class={styles.main}>{c()}</div>}</Show>

			<Show when={props.actions}>
				{c => <div class={joinClass(undefined, styles.actions, props.actionsClass)}>{c()}</div>}
			</Show>
		</header>
	);
}

export interface AppbarBrandProps extends StyleProps {
	/**
	 * 产品 LOGO
	 *
	 * @reactive
	 */
	logo?: string;

	/**
	 * 产品名称
	 *
	 * @reactive
	 */
	title?: string;

	/**
	 * 指向的链接
	 *
	 * @reactive
	 */
	href?: string;
}

/**
 * 生成一个适用于 {@link AppbarProps#brand} 的组件
 */
export function AppbarBrand(props: AppbarBrandProps): JSX.Element {
	return (
		<Dynamic class={styles.brand} component={props.href ? A : 'div'} href={props.href}>
			<Show when={props.logo}>
				<img alt={props.title || 'LOGO'} aria-hidden={true} class={styles.logo} src={props.logo} />
			</Show>
			<Show when={props.title}>{c => <h1 class={styles.name}>{c()}</h1>}</Show>
		</Dynamic>
	);
}
