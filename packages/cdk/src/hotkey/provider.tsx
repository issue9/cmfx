// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, type JSX, onCleanup, type ParentProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@cdk/errors';
import { type EventType, type HotkeyContext, Manager } from './context';

export interface HotkeyProviderProps extends ParentProps {
	/**
	 * 绑定的对象
	 *
	 * @defaultValue document
	 */
	readonly root?: HTMLElement;

	/**
	 * 注册的的事件类型
	 *
	 * @defaultValue 'keyup'
	 */
	readonly eventType?: EventType;
}

const hotkeyContext = createContext<HotkeyContext>();

/**
 * 提供快捷键管理
 */
export function HotkeyProvider(props: HotkeyProviderProps): JSX.Element {
	const mgr = new Manager(props.root ?? document, props.eventType);
	onCleanup(() => mgr.destroy());

	return <hotkeyContext.Provider value={mgr}>{props.children}</hotkeyContext.Provider>;
}

/**
 * 获取快捷键的管理接口
 */
export function useHotkey(): HotkeyContext {
	const ctx = useContext(hotkeyContext);
	if (!ctx) {
		throw new ContextNotFoundError('@cmfx/cdk.hotkeyContext');
	}
	return ctx;
}
