// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, type JSX, type ParentProps, splitProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@components/context';

export interface LockScreenContext {
	/**
	 * 调用锁屏
	 *
	 * @returns 是否需要显示锁屏界面
	 */
	lock(): Promise<void>;

	/**
	 * 取消锁屏
	 */
	unlock(): void;
}

const lockScreenContext = createContext<LockScreenContext>();

export function LockScreenProvider(props: ParentProps<LockScreenContext>): JSX.Element {
	const [, ctx] = splitProps(props, ['children']);
	return <lockScreenContext.Provider value={ctx}>{props.children}</lockScreenContext.Provider>;
}

export function useLockScreen(): LockScreenContext {
	const ctx = useContext(lockScreenContext);
	if (!ctx) {
		throw new ContextNotFoundError('lockScreenContext');
	}
	return ctx;
}
