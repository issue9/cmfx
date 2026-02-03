// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, Match, onMount, ParentProps, Switch } from 'solid-js';

import { BackTop, BackTopProps, BackTopRef } from '@components/backtop';
import { BaseProps, joinClass, RefProps } from '@components/base';
import { useLocale, useOptions } from '@components/context';
import styles from './style.module.css';

export interface Ref {
	/**
	 * 返回组件的根元素
	 */
	root(): HTMLDivElement;

	/**
	 * 返回顶部按钮的接口
	 */
	backtop(): BackTopRef;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 配置 {@link BackTop} 组件
	 *
	 * @remarks 可以有以下取值：
	 * - undefined 默认选项的 BackTop 组件；
	 * - false 不显示 BackTop 组件；
	 * - {@link BackTopProps} 自定义的 BackTop 组件属性；
	 */
	backtop?: false | Omit<BackTopProps, 'ref'>;

	/**
	 * 页面标题的翻译 ID
	 *
	 * @reactive
	 */
	title: string;
}

/**
 * 页面组件
 *
 * @remarks
 * 默认是 flex-col 布局。如果有需要，可自行指定 class 进行修改。
 */
export function Page(props: Props): JSX.Element {
	const [act] = useOptions();
	const l = useLocale();

	let ref: HTMLDivElement;
	let backtopRef: BackTopRef;

	createEffect(() => {
		act.setTitle(l.t(props.title));
	});

	onMount(() => {
		if (props.ref) {
			props.ref({
				root: () => ref,
				backtop: () => backtopRef,
			});
		}
	});

	return (
		<div
			ref={el => {
				ref = el;
			}}
			class={joinClass(props.palette, styles.page, props.class)}
			style={props.style}
		>
			{props.children}
			<Switch>
				<Match when={props.backtop === undefined}>
					<BackTop
						ref={el => {
							backtopRef = el;
						}}
					/>
				</Match>
				<Match when={props.backtop !== false ? props.backtop : undefined}>
					{p => (
						<BackTop
							{...p}
							ref={el => {
								backtopRef = el;
							}}
						/>
					)}
				</Match>
			</Switch>
		</div>
	);
}
