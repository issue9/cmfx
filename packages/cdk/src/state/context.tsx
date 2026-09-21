// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, type JSX, type ParentProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@cdk/errors';
import type { State } from './state';
import styles from './style.module.css';

interface StateBase {
	/**
	 * 组件状态
	 *
	 * @reactive
	 * @defaultValue 'enabled'
	 */
	state: State;
}

export interface StateContext extends StateBase {
	/**
	 * 当前状态的 CSS 类型名
	 *
	 * @reactive
	 *
	 * @see {@link StateProviderProps#getClass}
	 * @remarks
	 * 该值由 {@link StateProviderProps#getClass} 生成，
	 * 若函数返回 undefined，框架会为 {@link State} 类型提供默认类型，其它的值则为 undefined。
	 */
	class: string | undefined;
}

const stateContext = createContext<StateContext>();

export interface StateProviderProps extends StateBase, ParentProps {
	/**
	 * 根据状态返回对应的 CSS 类名
	 *
	 * @see {@link StateContext#class}
	 * @remarks
	 * 如果未指定此属性，那么只能处理 {@link State} 表示的各种状态。
	 */
	readonly getClass?: (s: State) => string | undefined;
}

/**
 * 为组件提供状态
 *
 * @typeParam S - 可用的状态类型
 */
export function StateProvider(props: StateProviderProps): JSX.Element {
	const getClass = (s: State): string => props.getClass?.(s) ?? styles[s];

	return (
		<stateContext.Provider
			value={{
				get state() {
					return props.state;
				},
				get class() {
					return getClass(props.state);
				},
			}}
		>
			{props.children}
		</stateContext.Provider>
	);
}

/**
 * 获取父组件的状态
 */
export function useState(): StateContext {
	const ctx = useContext(stateContext);
	if (!ctx) {
		throw new ContextNotFoundError('@cmfx/core.stateContext');
	}
	return ctx;
}
