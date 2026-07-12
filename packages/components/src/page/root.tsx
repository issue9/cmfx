// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import { createEffect, type JSX, Match, type ParentProps, Switch } from 'solid-js';

import { BackTop } from '@components/backtop';
import type { BaseRef, RefProps } from '@components/base';
import { useLocale, useOptions } from '@components/context';
import styles from './style.module.css';

export interface PageRef extends BaseRef<HTMLDivElement> {
	/**
	 * 返回顶部按钮的接口
	 */
	backTop(): BackTop.Ref | undefined;
}

export interface PageProps extends ThemeProps, ParentProps, RefProps<PageRef> {
	/**
	 * 配置 {@link BackTop} 组件
	 *
	 * @remarks 可以有以下取值：
	 * - undefined 默认选项的 BackTop 组件；
	 * - false 不显示 BackTop 组件；
	 * - {@link BackTop#RootProps} 自定义的 BackTop 组件属性；
	 */
	backTop?: false | Omit<BackTop.Props, 'ref'>;

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
export function Root(props: PageProps): JSX.Element {
	const [act] = useOptions();
	const l = useLocale();

	let rootRef: HTMLDivElement;

	createEffect(() => {
		act.setTitle(l.t(props.title));
	});

	return (
		<div
			ref={el => {
				rootRef = el;
				if (props.backTop === false && props.ref) {
					props.ref({
						root: () => rootRef,
						backTop: () => undefined,
					});
				}
			}}
			class={joinClass(props.palette, styles.page, props.class)}
			style={props.style}
		>
			{props.children}
			<Switch>
				<Match when={props.backTop === undefined}>
					<BackTop
						ref={el => {
							if (props.ref) {
								props.ref({
									root: () => rootRef,
									backTop: () => el,
								});
							}
						}}
					/>
				</Match>
				<Match when={props.backTop !== false ? props.backTop : undefined}>
					{p => (
						<BackTop
							{...p}
							ref={el => {
								if (props.ref) {
									props.ref({
										root: () => rootRef,
										backTop: () => el,
									});
								}
							}}
						/>
					)}
				</Match>
			</Switch>
		</div>
	);
}
