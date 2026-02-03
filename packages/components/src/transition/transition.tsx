// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps } from 'solid-js';
import { Transition as Trans, TransitionProps } from 'solid-transition-group';

import styles from './style.module.css';

const transition: TransitionProps = {
	// NOTE: mode === outin 时，在嵌套 Transition 时会出现子元素无法显示的问题。
	// inout 模式则切换动画看起来比较乱，所以采用默认值，表示两者同时进行。

	enterActiveClass: styles['enter-active'],
	enterClass: styles.enter,
	enterToClass: styles['enter-to'],

	exitActiveClass: styles['exit-active'],
	exitClass: styles.exit,
	exitToClass: styles['exit-to'],
};

/**
 * 提供一个转场动画的组件
 *
 * @remarks
 * 这是基于 {@link Trans|Transition} 的封装，提供了默认的样式和动画效果。
 *
 * NOTE: 如果 Transition 放在一个带 gap 的 flex 中，在切换时会出现同时存在两个元素的情况，
 * 虽然上一个元素已经不可见，便是 gap 依然是存在的，会造成父元素的尺寸变化，如果不想这种变化，
 * 需要将 Transition 放在一个单独的 div 中。
 */
export function Transition(props: ParentProps): JSX.Element {
	return <Trans {...transition}>{props.children}</Trans>;
}
