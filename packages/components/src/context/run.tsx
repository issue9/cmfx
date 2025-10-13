// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, RouteDefinition, RouteSectionProps } from '@solidjs/router';
import { Component } from 'solid-js';
import { render } from 'solid-js/web';

import { OptionsProvider } from './context';
import { Options } from './options';

/**
 * 运行项目
 *
 * @remarks 这会将参数 app 包含在 {@link OptionsProvider} 组件中。
 * 如果需要自定义功能，可以使用 {@link OptionsProvider} 组件手动提供参数。
 *
 * @param app - 实际的内容组件；
 * @param routes - 路由数据；
 * @param mountedElement - 组件挂载的元素；
 * @param options - 初始化参数；
 */
export function run(
    app: Component<RouteSectionProps>, routes: Array<RouteDefinition>, mountedElement: HTMLElement, options: Options
): void {
    const Root = (props: RouteSectionProps) => {
        return <OptionsProvider {...options}>{app(props)}</OptionsProvider>;
    };

    render(() => <HashRouter root={Root}>{routes}</HashRouter>, mountedElement);
}
