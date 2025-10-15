// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, RouteDefinition, RouteSectionProps } from '@solidjs/router';
import { Component } from 'solid-js';
import { render } from 'solid-js/web';

import { SystemDialog } from '@/dialog';
import { Notify } from '@/notify';
import { OptionsProvider } from './context';
import { Options } from './options';
import styles from './style.module.css';

/**
 * 运行项目
 *
 * @remarks 这会将参数 app 包含在 {@link OptionsProvider}、{@link SystemDialog} 和 {@link Notify} 包围的组件中。
 *
 * 此方法会将 'root' 作为 mountedElement 上的 `container-name` 值，
 * 其它组件的 css 样式会用到此属性，比如 {@link Notify} 就使用 `@sm/root:` 作为样式变体。
 * 如果不是通过此方法创建的，需要手动向 mountedElement 添加 `container-name` 属性。
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
