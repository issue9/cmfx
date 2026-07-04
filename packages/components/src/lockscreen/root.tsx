// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BaseProps } from '@cmfx/components';
import { type Component, type JSX, mergeProps, type ParentProps } from 'solid-js';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { LockScreenProvider, useLockScreen } from './context';
import { Password } from './screen';
import styles from './style.module.css';

export interface LockScreenRef extends BaseRef<HTMLDivElement> {}

export interface LockScreenProps extends ParentProps, BaseProps, RefProps<LockScreenRef> {
	/**
	 * 锁屏后的界面
	 */
	screen?: Component;
}

/**
 * 锁屏组件
 *
 * @remarks
 * 这是个防君子不防小人的组件，仅是在最上层添加了一个遮罩层，用于防止用户在锁屏状态下进行操作。
 */
export function LockScreen(props: LockScreenProps): JSX.Element {
	props = mergeProps({ screen: Password }, props);

	return (
		<LockScreenProvider>
			<Content {...props} />
		</LockScreenProvider>
	);
}

function Content(props: LockScreenProps): JSX.Element {
	const ctx = useLockScreen();

	return (
		<div
			ref={el => props.ref?.({ root: () => el })}
			class={joinClass(props.palette, styles['lock-screen'], props.class)}
			style={props.style}
		>
			<div class={joinClass(undefined, styles.screen, ctx.isLock() ? styles.locked : styles.unlocked)}>
				{props.screen!({})}
			</div>
			{props.children}
		</div>
	);
}
