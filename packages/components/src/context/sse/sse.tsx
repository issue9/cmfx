// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { ContextNotFoundError, type REST } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { createContext, createResource, Match, onCleanup, Switch, useContext } from 'solid-js';

import { type ProblemHandler, useOptions } from '@components/context/options';
import { useAPI } from '@components/context/rest';

export interface Props {
	/**
	 * SSE 服务的访问路径
	 */
	readonly path: string;

	/**
	 * 是否需要验证
	 */
	readonly auth?: boolean;
}

const sseContext = createContext<EventSource>();

/**
 * 提供一个 SSE 服务
 *
 * @remarks
 * 如果一个 SSE 服务端会推送多种类型的数据，可以在此初始化化 {@link EventSource}，
 * 之后再由 {@link useSSE} 各自订阅相关的事件即可，不用每次要 `await api.eventSource`。
 */
export function SSEProvider(props: ParentProps<Props>): JSX.Element {
	const [, opt] = useOptions();
	const [api] = useAPI();

	const [es] = createResource(async () => await api.eventSource(props.path, props.auth));
	onCleanup(() => es()?.close());

	return (
		<Switch fallback={opt.loading({})}>
			<Match when={!es.loading}>
				<sseContext.Provider value={es()}>{props.children}</sseContext.Provider>
			</Match>
		</Switch>
	);
}

/**
 * 订阅指定名称的 SSE 事件
 *
 * @remarks
 * SSE 事件在使用之前，需要调用服务端指定的接口打开该功能，使用完之后还需要关闭。
 *
 * @param name - 订阅的事件名称；
 * @param handler - 事件函数；
 * @param path - 服务端开关的访问路径；
 * @param rest - 用于打开服务端事件开关的；
 * @param handleProblem - 对访问服务端开头出错时的处理方法；
 * @returns 返回挂载和卸载两个函数；
 */
export function useSSE(
	name: string,
	handler: (s: MessageEvent) => void,
	path: string,
	rest: REST,
	handleProblem?: ProblemHandler,
): [mount: () => Promise<void>, unmount: () => Promise<void>] {
	const es = useContext(sseContext);
	if (!es) {
		throw new ContextNotFoundError('sseContext');
	}

	const mount = async (): Promise<void> => {
		es.addEventListener(name, handler);

		const r = await rest.post(path);
		if (!r.ok && handleProblem) {
			handleProblem(r.body);
		}
	};

	const unmount = async (): Promise<void> => {
		const r = await rest.delete(path);
		if (!r.ok && handleProblem) {
			handleProblem(r.body);
		}
		if (es) {
			es.removeEventListener(name, handler);
		}
	};
	return [mount, unmount];
}
