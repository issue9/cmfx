// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, type JSX, type ParentProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@cdk/errors';
import type { State } from './state';
import styles from './style.module.css';

interface StateBase<S extends State> {
	/**
	 * 组件状态
	 *
	 * @reactive
	 * @defaultValue 'enabled'
	 */
	state: S;
}

export interface StateContext<S extends State> extends StateBase<S> {
	/**
	 * 当前状态的 CSS 类型名
	 *
	 * @reactive
	 */
	class: string;
}

const stateContext = createContext<StateContext<State>>();

export interface StateProviderProps<S extends State> extends StateBase<S>, ParentProps {
	/**
	 * 根据状态返回对应的 CSS 类名
	 *
	 * @returns 如果返回 undefined，则采用默认值。
	 */
	readonly getClass?: (s: State) => string | undefined;
}

/**
 * 为组件提供状态
 */
export function StateProvider<S extends State>(props: StateProviderProps<S>): JSX.Element {
	return (
		<stateContext.Provider
			value={{
				state: props.state,
				class: props.getClass?.(props.state) ?? styles[props.state],
			}}
		>
			{props.children}
		</stateContext.Provider>
	);
}

/**
 * 获取父组件的状态
 */
export function useState<S extends State>(): StateContext<S> {
	const ctx = useContext(stateContext);
	if (!ctx) {
		throw new ContextNotFoundError('@cmfx/core.stateContext');
	}
	return ctx as StateContext<S>;
}
