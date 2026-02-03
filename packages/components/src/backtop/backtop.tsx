// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { getScrollableParent } from '@cmfx/core';
import { JSX, mergeProps, onCleanup, onMount, ParentProps } from 'solid-js';
import IconVerticalAlignTop from '~icons/material-symbols/vertical-align-top';

import { BaseProps, joinClass, RefProps } from '@components/base';
import { Button, ButtonRef } from '@components/button';
import { useLocale } from '@components/context';
import styles from './style.module.css';

export interface Ref {
	root(): ButtonRef;

	/**
	 * 返回页面顶部
	 *
	 * @remarks
	 * 该功能与直接点击按钮具有相同的效果。
	 */
	backtop(): void;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 当容器顶部不可见区域达到此值时才会显示按钮，默认为 10。
	 *
	 * @defaultValue 10
	 */
	distance?: number;

	/**
	 * 是否为圆形
	 *
	 * @reactive
	 */
	rounded?: boolean;
}

/**
 * 返回顶部的按钮
 *
 * @remarks
 * 该组件会向上查找包含 overflow-y、overflow-block 或是 overflow 样式的组件，如果能找到，将功能用在此组件上。
 */
export function BackTop(props: Props): JSX.Element {
	const l = useLocale();
	props = mergeProps({ distance: 10 }, props);

	let ref: ButtonRef;
	let scroller: HTMLElement | undefined;

	const calcVisible = () => {
		// 计算按钮的可见性
		ref.root().style.visibility = scroller!.scrollTop > props.distance! ? 'visible' : 'hidden';
	};

	const backtop = () => {
		if (scroller) {
			scroller.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	onMount(() => {
		scroller = getScrollableParent('y', ref.root());
		if (!scroller) {
			return;
		}

		calcVisible(); // 初始化状态
		scroller!.addEventListener('scroll', calcVisible);
	});

	onCleanup(() => {
		if (scroller) {
			scroller.removeEventListener('scroll', calcVisible);
		}
	});

	return (
		<Button
			square
			rounded={props.rounded}
			palette={props.palette}
			ref={el => {
				ref = el;
				ref.root().ariaLabel = l.t('_c.backtop');

				if (props.ref) {
					props.ref({
						root() {
							return ref;
						},
						backtop() {
							backtop();
						},
					});
				}
			}}
			class={joinClass(undefined, styles.backtop, props.class)}
			style={props.style}
			onclick={() => backtop()}
		>
			{props.children ?? <IconVerticalAlignTop aria-hidden="true" />}
		</Button>
	);
}
