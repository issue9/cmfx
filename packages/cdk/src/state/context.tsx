// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, type JSX, type ParentProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@cdk/errors';
import type { State } from './state';
import styles from './style.module.css';

interface StateBase<S extends string = State> {
	/**
	 * 组件状态
	 *
	 * @reactive
	 * @defaultValue 'enabled'
	 */
	state: S;
}

export interface StateContext<S extends string = State> extends StateBase<S> {
	/**
	 * 当前状态的 CSS 类型名
	 *
	 * @reactive
	 *
	 * @remarks
	 * 该值由 {@link StateProviderProps#getClass} 生成，
	 * 若函数返回 undefined，则由框架提供的默认样式。
	 */
	class: string;
}

const stateContext = createContext<StateContext<string>>();

export interface StateProviderProps<S extends string = State> extends StateBase<S>, ParentProps {
	/**
	 * 根据状态返回对应的 CSS 类名
	 *
	 * @see {@link StateContext#class}
	 * @remarks
	 * 如果未指定此属性，那么只能处理 {@link State} 表示的各种状态。
	 */
	readonly getClass?: (s: S) => string | undefined;
}

/**
 * 为组件提供状态
 *
 * @typeParam S - 可用的状态类型
 */
export function StateProvider<S extends string = State>(props: StateProviderProps<S>): JSX.Element {
	const getClass = (s: S): string => props.getClass?.(s) ?? styles[s];

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
export function useState<S extends string = State>(): StateContext<S> {
	const ctx = useContext(stateContext);
	if (!ctx) {
		throw new ContextNotFoundError('@cmfx/core.stateContext');
	}
	return ctx as StateContext<S>;
}
