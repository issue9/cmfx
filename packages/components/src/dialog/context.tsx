// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, type JSX, type ParentProps, splitProps, useContext } from 'solid-js';

import type { BaseRef } from '@components/base';
import { ContextNotFoundError } from '@components/context';

export interface Ref extends BaseRef<HTMLDialogElement> {
	/**
	 * 移动对话框的位置
	 *
	 * @param p - 如果为 undefined，那么将会居中显示，否则显示在指定位置。
	 */
	move(p?: { x: number | string; y: number | string }): void;
}

export interface Context {
	dialog: Ref;
}

const dialogContext = createContext<Context>();

export function DialogProvider(props: ParentProps & Context): JSX.Element {
	const [_, ctx] = splitProps(props, ['children']);
	return <dialogContext.Provider value={ctx}>{props.children}</dialogContext.Provider>;
}

/**
 * 获取对话框组件的上下文
 */
export function useDialog(): Context {
	const ctx = useContext(dialogContext);
	if (!ctx) {
		throw new ContextNotFoundError('dialogContext');
	}
	return ctx;
}
