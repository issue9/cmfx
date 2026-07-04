// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, createSignal, type JSX, type ParentProps, useContext } from 'solid-js';

import { ContextNotFoundError, useOptions } from '@components/context';

export interface LockScreenContext {
	/**
	 * 设置锁屏密码
	 */
	setPassword(val: string): void;

	/**
	 * 删除锁屏密码
	 */
	removePassword(): void;

	/**
	 * 验证锁屏密码
	 */
	validPassword(val: string): boolean;

	/**
	 * 设置锁屏标记
	 */
	lock(): void;

	/**
	 * 删除锁屏标记
	 */
	unlock(): void;

	/**
	 * 是否处于锁屏状态
	 */
	isLock(): boolean;
}

const lockScreenContext = createContext<LockScreenContext>();

const passwordID = 'lockscreen-password';

const lockID = 'lockscreen-lock';

export function LockScreenProvider(props: ParentProps): JSX.Element {
	const [, opt] = useOptions();
	const [locked, setLocked] = createSignal(!!opt.config.get(lockID));

	const val = {
		setPassword(val: string): void {
			opt.config.set(passwordID, val);
		},

		removePassword(): void {
			opt.config.remove(passwordID);
		},

		validPassword(val: string): boolean {
			return opt.config.get(passwordID) === val;
		},

		lock(): void {
			opt.config.set(lockID, true);
			setLocked(true);
		},

		unlock(): void {
			opt.config.remove(lockID);
			setLocked(false);
		},

		isLock(): boolean {
			return locked();
		},
	} satisfies LockScreenContext;

	return <lockScreenContext.Provider value={val}>{props.children}</lockScreenContext.Provider>;
}

export function useLockScreen(): LockScreenContext {
	const ctx = useContext(lockScreenContext);
	if (!ctx) {
		throw new ContextNotFoundError('lockScreenContext');
	}
	return ctx;
}
