// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { createContext, type JSX, type ParentProps, splitProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@cdk/errors';
import styles from './style.module.css';

/**
 * 组件的通用状态
 */
export type State = 'enabled' | 'disabled';

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
	 */
	class: string;
}

const stateContext = createContext<StateContext>();

/**
 * 为组件提供状态
 */
export function StateProvider(props: ParentProps<StateBase>): JSX.Element {
	const [_, p] = splitProps(props, ['children']);
	const v: StateContext = {
		...p,
		class: styles[p.state],
	};

	return <stateContext.Provider value={v}>{props.children}</stateContext.Provider>;
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
