// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, RouteDefinition, Router, RouteSectionProps } from '@solidjs/router';
import { Component } from 'solid-js';
import { render } from 'solid-js/web';

import { default as SystemDialog } from '@components/dialog/system';
import { Notify } from '@components/notify/notify';
import { Clipboard } from './clipboard';
import { OptionsProvider } from './context';
import { Options, requiredOptions } from './options';
import styles from './style.module.css';

/**
 * 运行项目
 *
 * @remarks
 * 此方法提供了当前组件库一些必不可少的条件，比如 {@link useOptions} 等的数据，
 * 所以组件库必须要以此方法作为入口，否则部分组件可能无法正常运行。
 *
 * 此方法会将 'root' 作为 mountedElement 上的 `container-name` 值，
 * 子组件的 css 样式可以使用此作为容器查询，比如 {@link Notify} 就使用 `@sm/root:` 作为样式变体。
 *
 * @param app - 实际的内容组件；
 * @param mountedElement - 组件挂载的元素；
 * @param o - 初始化参数；
 * @param routes - 路由数据；
 * @param router - 指定路由类型，默认为 {@link HashRouter}；
 */
export function run(
    app: Component<RouteSectionProps>, mountedElement: HTMLElement, o: Options,
    routes: Array<RouteDefinition>, router: typeof Router = HashRouter
): void {
    mountedElement.classList.add(styles.root);
    const opt = requiredOptions(o);

    const Root = (props: RouteSectionProps) => {
        return <OptionsProvider {...opt}>
            <SystemDialog mount={mountedElement} palette='primary'>
                <Notify mount={mountedElement} palette='error'>
                    <Clipboard>{app(props)}</Clipboard>
                </Notify>
            </SystemDialog>
        </OptionsProvider>;
    };

    render(() => router({ root: Root, children: routes }), mountedElement);
}
