// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, type RouteDefinition, type Router, type RouteSectionProps } from '@solidjs/router';
import type { Component } from 'solid-js';
import { render } from 'solid-js/web';

import type { Options } from '@components/context/options/options';
import { App } from './app';

/**
 * 运行项目
 *
 * @param mountedElement - 组件挂载的元素，参考 {@link AppProps#mountedElement}；
 * @param o - 初始化参数；
 * @param routes - 路由数据；
 * @param app - 介绍根组件和路由组件之间的内容，如果为空则路由切换时直接显示路由中的内容；
 * @param router - 指定路由类型，默认为 {@link HashRouter}；
 */
export function run(
	mountedElement: HTMLElement,
	o: Options,
	routes: Array<RouteDefinition>,
	app?: Component<RouteSectionProps>,
	router: typeof Router = HashRouter,
): void {
	const Root = (props: RouteSectionProps) => (
		<App {...o} mountedElement={mountedElement}>
			{app ? app(props) : props.children}
		</App>
	);

	render(() => router({ root: Root, children: routes }), mountedElement);
}
