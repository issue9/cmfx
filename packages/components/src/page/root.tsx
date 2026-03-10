// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, Match, onMount, ParentProps, Switch } from 'solid-js';

import { BackTop } from '@components/backtop';
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
	backTop(): BackTop.RootRef;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 配置 {@link BackTop} 组件
	 *
	 * @remarks 可以有以下取值：
	 * - undefined 默认选项的 BackTop 组件；
	 * - false 不显示 BackTop 组件；
	 * - {@link BackTop#RootProps} 自定义的 BackTop 组件属性；
	 */
	backTop?: false | Omit<BackTop.RootProps, 'ref'>;

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
export function Root(props: Props): JSX.Element {
	const [act] = useOptions();
	const l = useLocale();

	let ref: HTMLDivElement;
	let backTopRef: BackTop.RootRef;

	createEffect(() => {
		act.setTitle(l.t(props.title));
	});

	onMount(() => {
		if (props.ref) {
			props.ref({
				root: () => ref,
				backTop: () => backTopRef,
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
				<Match when={props.backTop === undefined}>
					<BackTop.Root
						ref={el => {
							backTopRef = el;
						}}
					/>
				</Match>
				<Match when={props.backTop !== false ? props.backTop : undefined}>
					{p => (
						<BackTop.Root
							{...p}
							ref={el => {
								backTopRef = el;
							}}
						/>
					)}
				</Match>
			</Switch>
		</div>
	);
}
