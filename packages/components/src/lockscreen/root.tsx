// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BaseProps } from '@cmfx/components';
import { createSignal, type JSX, mergeProps, type ParentProps, splitProps } from 'solid-js';

import { type BaseRef, joinClass, type RefProps } from '@components/base';
import { useLocale } from '@components/context';
import { type LockScreenContext, LockScreenProvider } from './context';
import { type LockScreenAction, LockScreenPassword, type LockScreenScreenProps } from './action';
import styles from './style.module.css';

export interface LockScreenRef extends BaseRef<HTMLDivElement> {}

export interface LockScreenProps extends ParentProps, BaseProps, RefProps<LockScreenRef>, LockScreenScreenProps {
	/**
	 * 指定锁屏的操作界面
	 *
	 * @defaultValue {@link LockScreenPassword}
	 */
	action?: LockScreenAction;
}

/**
 * 锁屏组件
 *
 * @remarks
 * 这是个防君子不防小人的组件，仅是在最上层添加了一个遮罩层，用于防止用户在锁屏状态下进行操作。
 */
export function LockScreen(props: LockScreenProps): JSX.Element {
	props = mergeProps({ action: new LockScreenPassword() }, props);
	const [locked, setLocked] = createSignal(false);
	const l = useLocale();

	const ctx = {
		async lock(): Promise<void> {
			setLocked(!!(await props.action?.password(l)));
		},

		unlock(): void {
			setLocked(false);
		},
	} satisfies LockScreenContext;

	const [screenProps] = splitProps(props, ['logout', 'avatar', 'name']);

	return (
		<LockScreenProvider {...ctx}>
			<div
				ref={el => props.ref?.({ root: () => el })}
				class={joinClass(props.palette, styles['lock-screen'], props.class)}
				style={props.style}
			>
				<div class={joinClass(undefined, styles.screen, locked() ? styles.locked : styles.unlocked)}>
					{props.action?.screen?.(screenProps)}
				</div>
				{props.children}
			</div>
		</LockScreenProvider>
	);
}
