// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, Navigate } from '@solidjs/router';
import { createEffect, createMemo, createSignal, ErrorBoundary, JSX, Match, ParentProps, Show, Switch } from 'solid-js';
import { render } from 'solid-js/web';

import { Drawer, List, Notify, SystemDialog } from '@/components';
import { API, compareBreakpoint, Locale } from '@/core';
import { buildContext, useApp, useOptions } from './context';
import * as errors from './errors';
import { build as buildOptions, Options } from './options';
import { buildItems, floatAsideWidth, MenuVisibleProps, default as Toolbar } from './toolbar';

/**
 * 初始化整个项目
 *
 * @param elementID 挂载的元素 ID，用户需要在该元素上指定高和宽，
 *  如果要占满页面可以用 100dvh 和 100dvw 或是预定义的类 view-full；
 * @param o 项目的初始化选项；
 */
export async function create(elementID: string, o: Options) {
    const opt = buildOptions(o);
    const api = await API.build(opt.api.base, opt.api.login, opt.mimetype, opt.locales.fallback);
    await api.cache(opt.api.info);

    Locale.init(opt.locales.fallback, api);
    for(const item of Object.entries(opt.locales.messages)) {
        await Locale.addDict(item[0], ...item[1]);
    }

    render(() => (<App opt={opt} api={api} />), document.getElementById(elementID)!);
}

/**
 * 项目的根组件
 */
function App(props: {opt: Required<Options>, api: API}) {
    const menuVisible = createSignal(true);

    const Root = (p: ParentProps) => {
        // buildContext 中使用了 useContext 和 useNavigate，必须得 Router 之内使用。
        const { Provider } = buildContext(props.opt, props.api);

        return <Provider>
            <Notify />
            <Show when={props.opt.system.dialog}>
                <SystemDialog palette='surface' />
            </Show>
            <div class="app palette--surface">
                <Toolbar menuVisible={menuVisible} />
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
                <Private menuVisible={menuVisible}>{ props.children }</Private>,

            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [...props.opt.routes.private.routes, { path: '*', component: errors.NotFound }]
        }
    ];

    return <HashRouter root={Root}>{/*@once*/routes}</HashRouter>;
}

export function Private(props: ParentProps & MenuVisibleProps) {
    const ctx = useApp();
    const opt = useOptions();
    const floating = createMemo(() => compareBreakpoint(ctx.breakpoint(), floatAsideWidth) < 0);
    createEffect(() => {
        if (!floating()) {
            props.menuVisible[1](true);
        }
    });

    return <Switch>
        <Match when={!ctx.isLogin()}>
            <Navigate href={/*@once*/opt.routes.public.home} />
        </Match>
        <Match when={ctx.isLogin()}>
            <Drawer floating={floating()} palette='secondary' mainID='main-content'
                close={()=>props.menuVisible[1](false)}
                visible={props.menuVisible[0]()}
                main={
                    <ErrorBoundary fallback={err=>errors.Unknown(err)}>{props.children}</ErrorBoundary>
                }>
                <List anchor>{buildItems(ctx.locale(), opt.menus)}</List>
            </Drawer>
        </Match>
    </Switch>;
}