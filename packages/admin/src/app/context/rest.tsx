// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { ContextNotFoundError, useLocale } from '@cmfx/components';
import { API, REST } from '@cmfx/core';
import { createContext, JSX, ParentProps, useContext } from 'solid-js';

const apiContext = createContext<API>();

/**
 * 初始化 {@link useAPI} 和 {@link useREST} 的使用环境
 *
 * @remarks
 * 依赖 {@link OptionsProvider} 组件，必须在其之内使用。
 */
export function APIProvider(props: ParentProps<{ api: API }>): JSX.Element {
	return <apiContext.Provider value={props.api}>{props.children}</apiContext.Provider>;
}

/**
 * 返回 {@link API} 对象
 */
export function useAPI(): API {
	const ctx = useContext(apiContext);
	if (!ctx) {
		throw new ContextNotFoundError('apiContext');
	}

	return ctx;
}

/**
 * 返回与后端通讯的基本接口集合
 *
 * @remarks
 * 与 {@link useAPI} 的不同点在于只提供了基本的功能，但是会添加一个基于当前环境的 Accept-Language 报头信息。
 */
export function useREST(): REST {
	const api = useAPI();
	const l = useLocale();
	return api.rest({ headers: { 'Accept-Language': l.locale.toString() } });
}
