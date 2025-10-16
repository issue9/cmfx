// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, RouteDefinition, RouteSectionProps } from '@solidjs/router';
import { Component } from 'solid-js';
import { render } from 'solid-js/web';

import { default as SystemDialog } from '@/dialog/system';
import { default as Notify } from '@/notify/notify';
import { OptionsProvider } from './context';
import { Options } from './options';
import styles from './style.module.css';

/**
 * 运行项目
 *
 * @remarks 此方法会将 'root' 作为 mountedElement 上的 `container-name` 值，
 * 子组件的 css 样式可以使用此作为容器查询，比如 {@link Notify} 就使用 `@sm/root:` 作为样式变体。
 *
 * @param app - 实际的内容组件；
 * @param routes - 路由数据；
 * @param mountedElement - 组件挂载的元素；
 * @param o - 初始化参数；
 */
export function run(
    app: Component<RouteSectionProps>, routes: Array<RouteDefinition>, mountedElement: HTMLElement, o: Options
): void {
    mountedElement.classList.add(styles.root);

    const Root = (props: RouteSectionProps) => {
        return <OptionsProvider {...o}>
            <SystemDialog mount={mountedElement} palette='secondary'>
                <Notify mount={mountedElement} palette='error'>{app(props)}</Notify>
            </SystemDialog>
        </OptionsProvider>;
    };

    render(() => <HashRouter root={Root}>{routes}</HashRouter>, mountedElement);
}
