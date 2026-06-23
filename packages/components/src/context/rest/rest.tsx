// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { API, REST } from '@cmfx/core';
import { createContext, type JSX, type ParentProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@components/context/errors';
import { useLocale } from '@components/context/locale';
import { type ProblemHandler, useOptions } from '@components/context/options';

const apiContext = createContext<API>();

/**
 * 初始化 {@link useAPI} 和 {@link useREST} 的使用环境
 */
export function APIProvider(props: ParentProps<{ api: API }>): JSX.Element {
	return <apiContext.Provider value={props.api}>{props.children}</apiContext.Provider>;
}

/**
 * 返回 {@link API} 对象
 */
export function useAPI(): [API, ProblemHandler] {
	const [, opt] = useOptions();

	const ctx = useContext(apiContext);
	if (!ctx) {
		throw new ContextNotFoundError('apiContext');
	}

	return [ctx, opt.problemHandler];
}

/**
 * 返回与后端通讯的基本接口集合
 *
 * @remarks
 * 与 {@link useAPI} 的不同点在于只提供了基本的功能，但是会添加一个基于当前环境的 Accept-Language 报头信息。
 */
export function useREST(): [REST, ProblemHandler] {
	const [api, h] = useAPI();
	const l = useLocale();

	const rest = api.rest({ headers: { 'Accept-Language': l.locale.toString() } });
	return [rest, h];
}
