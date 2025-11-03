// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, DrawerRef, MenuRef, joinClass, Menu, notify, run, Options as XOptions } from '@cmfx/components';
import { Problem } from '@cmfx/core';
import { Navigate, Router, RouteSectionProps } from '@solidjs/router';
import { createSignal, ErrorBoundary, JSX, Match, onMount, ParentProps, Setter, Switch } from 'solid-js';

import { useAdmin, useLocale } from '@/context';
import { Provider } from '@/context/context';
import { build as buildOptions, Options } from '@/options/options';
import * as errors from './errors';
import styles from './style.module.css';
import { buildItems, default as Toolbar } from './toolbar';

/**
 * 初始化整个项目
 *
 * @param elementID - 挂载的元素 ID；
 * @param o - 项目的初始化选项；
 * @param router - 指定路由对象，默认为 {@link HashRouter}；
 */
export function create(elementID: string, o: Options, router?: typeof Router) {
    const opt = buildOptions(o);
    const [drawerRef, setDrawerRef] = createSignal<DrawerRef>();

    const routes = [
        {
            path: '/',
            component: (props: { children?: JSX.Element }) => <>{props.children}</>,
            children: opt.routes.public.routes
        },
        {
            path: '/',
            component: (props: { children?: JSX.Element }) =>
                <Private setDrawer={setDrawerRef}>{props.children}</Private>,

            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [...opt.routes.private.routes, { path: '*', component: errors.NotFound }]
        }
    ];

    const xo: XOptions = {
        id: opt.id,
        storage: opt.storage,
        configName: opt.configName,
        logo: opt.logo,
        systemNotify: !!opt.system.notification,
        systemDialog: !!opt.system.dialog,

        scheme: opt.theme.scheme,
        schemes: opt.theme.schemes,
        mode: opt.theme.mode,

        locale: opt.locales.fallback,
        displayStyle: opt.locales.displayStyle!,
        messages: opt.locales.messages,

        apiBase: opt.api.base,
        apiToken: opt.api.token,
        apiAcceptType: opt.api.acceptType,
        apiContentType: opt.api.contentType,

        title: opt.title,
        titleSeparator: opt.titleSeparator,
        pageSizes: opt.api.pageSizes,
        pageSize: opt.api.presetSize,
        stays: opt.stays,
        outputProblem: async function <P>(p?: Problem<P>): Promise<void> {
            if (!p) {
                throw '发生了一个未知的错误，请联系管理员！';
            }

            if (p.status === 401) {
                throw new errors.HTTPError(401, p.title);
            } else if (p.status >= 500) {
                throw new errors.HTTPError(p.status, p.title);
            } else { // 其它 4XX 错误弹出提示框
                await notify(p.title, p.detail, 'error');
            }
        }
    };

    const root = (p: RouteSectionProps) => {
        return <Provider {...opt}>
            <div class={ joinClass('surface', styles.app) }>
                <Toolbar drawer={drawerRef} />
                <main class={styles.main}>{p.children}</main>
            </div>
        </Provider>;
    };

    run(root, routes, document.getElementById(elementID)!, xo, router);
}

function Private(props: ParentProps<{setDrawer: Setter<DrawerRef | undefined>;}>): JSX.Element {
    const l = useLocale();
    let menuRef: MenuRef;
    const [api, act, opt] = useAdmin();

    onMount(() => menuRef.scrollSelectedIntoView());

    return <Switch>
        <Match when={!api.isLogin()}>
            <Navigate href={/*@once*/opt.routes.public.home} />
        </Match>
        <Match when={act.isLogin()}>
            <Drawer floating={opt.aside.floatingMinWidth} palette='tertiary' ref={props.setDrawer} mainPalette='surface'
                main={
                    <ErrorBoundary fallback={err => (<errors.ErrorHandler err={err} />)}>{props.children}</ErrorBoundary>
                }>
                <Menu ref={el => menuRef = el} class={styles.aside} layout='inline'
                    items={buildItems(l, opt.aside.menus)} />
            </Drawer>
        </Match>
    </Switch>;
}
