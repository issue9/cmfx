// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, RouteDefinition } from '@solidjs/router';
import { JSX, Show, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { Drawer, Notify, SystemDialog } from '@/components';
import { Fetcher, initTheme } from '@/core';
import { buildContext } from './context';
import * as errors from './errors';
import { Options, build as buildOptions } from './options';
import { Private } from './private';
import XSetting from './settings';
import { default as Toolbar } from './toolbar';

/**
 * 初始化整个项目
 *
 * @param elementID 挂载的元素 ID，用户需要在该元素上指定高和宽，
 *  如果要占满页面可以用 100dvh 和 100dvw 或是预定义的类 view-full；
 * @param o 项目的初始化选项；
 */
export async function create(elementID: string, o: Options) {
    const opt = buildOptions(o);
    const f = await Fetcher.build(opt.api.base, opt.api.login, opt.mimetype, opt.locales.fallback);

    render(() => {
        initTheme(opt.theme.mode,opt.theme.scheme, opt.theme.contrast);
        return <>
            <Notify />
            <App opt={opt} f={f} />
        </>;
    }, document.getElementById(elementID)!);
}

/**
* 项目的根组件
*/
function App(props: {opt: Required<Options>, f: Fetcher}) {
    const { Provider } = buildContext(props.opt, props.f); // buildContext 必须在组件内使用！

    const [showSettings, setShowSettings] = createSignal(false);

    const Root = (p: { children?: JSX.Element }) => (<Provider>
        <Show when={props.opt.system.dialog}>
            <SystemDialog header={/*@once*/props.opt.title} palette='surface' />
        </Show>
        <div class="app palette--surface">
            <Toolbar settingsVisibleGetter={showSettings} settingsVisibleSetter={setShowSettings} />
            <main class="app-main">
                <Drawer pos="right" palette='secondary' main={p.children} floating
                    visible={showSettings()} close={() => setShowSettings(false)}>
                    <XSetting />
                </Drawer>
            </main>
        </div>
    </Provider>);

    return <HashRouter root={Root}>{buildRoutes(props.opt)}</HashRouter>;
}

/**
 * 生成适合 HashRouter 的路由项
 */
function buildRoutes(opt: Required<Options>): Array<RouteDefinition> {
    return [
        {
            path: '/',
            component: (props: {children?: JSX.Element})=><>{props.children}</>,
            children: opt.routes.public.routes
        },
        {
            path: '/',
            component: Private,
            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [ ...opt.routes.private.routes, { path:'*', component: errors.NotFound } ]
        }
    ];
}
