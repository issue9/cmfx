// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, Navigate, RouteSectionProps } from '@solidjs/router';
import { createEffect, createSignal, ErrorBoundary, JSX, Match, ParentProps, Show, Switch } from 'solid-js';
import { render } from 'solid-js/web';

import { AppOptions, buildOptions, Drawer, List, Notify, SystemDialog, useApp, useOptions } from '@/components';
import { buildContext } from '@/components/context/context';
import { API, Locale } from '@/core';
import * as errors from './errors';
import { buildItems, MenuVisibleProps, default as Toolbar } from './toolbar';

/**
 * 初始化整个项目
 *
 * @param elementID 挂载的元素 ID，用户需要在该元素上指定高和宽，
 *  如果要占满页面可以用 100dvh 和 100dvw 或是预定义的类 view-full；
 * @param o 项目的初始化选项；
 */
export async function create(elementID: string, o: AppOptions): Promise<void> {
    const opt = buildOptions(o);

    const api = await API.build(localStorage, opt.api.base, opt.api.login, opt.mimetype, opt.locales.fallback);
    await api.clearCache(); // 刷新或是重新打开之后，清除之前的缓存。
    api.cache(opt.api.info);

    Locale.init(opt.locales.fallback, api);
    for(const item of Object.entries(opt.locales.messages)) {
        await Locale.addDict(item[0], ...item[1]);
    }

    render(() => (<App opt={opt} api={api} />), document.getElementById(elementID)!);
}

/**
 * 项目的根组件
 */
function App(props: {opt: Required<AppOptions>, api: API}): JSX.Element {
    const menuVisible = createSignal(true);
    const floating = 'xs';

    const Root = (p: RouteSectionProps) => {
        // buildContext 中使用了 useNavigate 和 useLocation，必须得 Router 之内使用。
        const { Provider } = buildContext(props.opt, props.api);

        return <Provider>
            <Notify />
            <Show when={props.opt.system.dialog}>
                <SystemDialog palette='surface' />
            </Show>
            <div class="app palette--surface">
                <Toolbar menuVisible={menuVisible} floatingSidebar={floating} />
                <main class="app-main">{p.children}</main>
            </div>
        </Provider>;
    };

    const routes = [
        {
            path: '/',
            component: (props: { children?: JSX.Element }) => <>{props.children}</>,
            children: props.opt.routes.public.routes
        },
        {
            path: '/',
            component: (props: { children?: JSX.Element })=>
                <Private floatingSidebar={floating} menuVisible={menuVisible}>{ props.children }</Private>,

            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [...props.opt.routes.private.routes, { path: '*', component: errors.NotFound }]
        }
    ];

    return <HashRouter root={Root}>{/*@once*/routes}</HashRouter>;
}

function Private(props: ParentProps & MenuVisibleProps): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    createEffect(() => {
        if (!props.floatingSidebar) { props.menuVisible[1](true); }
    });

    return <Switch>
        <Match when={!ctx.isLogin()}>
            <Navigate href={/*@once*/opt.routes.public.home} />
        </Match>
        <Match when={ctx.isLogin()}>
            <Drawer floating={props.floatingSidebar} palette='secondary' mainID='main-content'
                close={()=>props.menuVisible[1](false)} visible={props.menuVisible[0]()}
                main={
                    <ErrorBoundary fallback={err=>errors.Unknown(err)}>{props.children}</ErrorBoundary>
                }>
                <List anchor>{buildItems(ctx.locale(), opt.menus)}</List>
            </Drawer>
        </Match>
    </Switch>;
}