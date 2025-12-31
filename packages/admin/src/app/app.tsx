// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, DrawerRef, joinClass, Menu, MenuRef, run, useLocale } from '@cmfx/components';
import { API, Config } from '@cmfx/core';
import { Navigate, Router, RouteSectionProps } from '@solidjs/router';
import { createSignal, ErrorBoundary, JSX, Match, onMount, ParentProps, Setter, Switch } from 'solid-js';

import { AdminProvider, APIProvider, OptionsProvider, useAdmin, useAPI, useOptions } from './context';
import * as errors from './errors';
import { build as buildOptions, Options } from './options';
import styles from './style.module.css';
import { buildItems, default as Toolbar } from './toolbar';

/**
 * 初始化整个项目
 *
 * @param elementID - 挂载的元素 ID；
 * @param o - 项目的初始化选项；
 * @param router - 指定路由对象，默认为 {@link HashRouter}；
 */
export async function create(elementID: string, o: Options, router?: typeof Router) {
    const opt = buildOptions(o);
    const [drawerRef, setDrawerRef] = createSignal<DrawerRef>();

    const routes = [
        {
            path: '/',
            component: (props: { children?: JSX.Element }) => <Public>{props.children}</Public>,
            children: [...opt.routes.public.routes, { path: '*', component: errors.NotFound }]
        },
        {
            path: '/',
            component: (props: { children?: JSX.Element }) =>
                <Private setDrawer={setDrawerRef}>{props.children}</Private>,

            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [...opt.routes.private.routes, { path: '*', component: errors.NotFound }]
        }
    ];

    const xo = {
        // 非机密数据，且有固化要求，使用 localStorage 存储，不考虑其它。
        config: new Config(opt.id, opt.configName, localStorage),
        logo: opt.logo,
        systemNotify: opt.systemNotify,
        systemDialog: opt.systemDialog,

        scheme: opt.scheme,
        schemes: opt.schemes,
        mode: opt.mode,

        locale: opt.locale,
        displayStyle: opt.displayStyle,
        messages: opt.messages,
        timezone: opt.timezone,

        title: opt.title,
        titleSeparator: opt.titleSeparator,
        pageSizes: opt.api.pageSizes,
        pageSize: opt.api.pageSize,
        stays: opt.stays,
    };

    const api = await API.build(opt.id+'-token', opt.tokenStorage, opt.api.base,
        opt.api.token, opt.api.contentType, opt.api.acceptType, opt.locale);

    await api.clearCache(); // 缓存不应该长期保存，防止上次退出时没有清除缓存。

    const root = (p: RouteSectionProps) => {
        return <OptionsProvider {...opt}>
            <APIProvider api={api}>
                <ErrorBoundary fallback={err => <errors.ErrorHandler err={err} />}>
                    <AdminProvider>
                        <div class={joinClass('surface', styles.app)}>
                            <Toolbar drawer={drawerRef} />
                            <main class={styles.main}>{p.children}</main>
                        </div>
                    </AdminProvider>
                </ErrorBoundary>
            </APIProvider>
        </OptionsProvider>;
    };

    run(root, document.getElementById(elementID)!, xo, routes, router);
}

function Public(props: ParentProps): JSX.Element {
    return <ErrorBoundary fallback={err => <errors.ErrorHandler err={err} />}>
        {props.children}
    </ErrorBoundary>;
}

function Private(props: ParentProps<{setDrawer: Setter<DrawerRef | undefined>;}>): JSX.Element {
    const l = useLocale();
    let menuRef: MenuRef;
    const usr = useAdmin();
    const api = useAPI();
    const opt = useOptions();

    onMount(() => {
        if (menuRef) { menuRef.scrollSelectedIntoView(); }
    });

    return <Switch>
        <Match when={!api.isLogin()}>
            <Navigate href={/*@once*/opt.routes.public.home} />
        </Match>
        <Match when={usr.isLogin()}>
            <Drawer floating={opt.floatingMinWidth} palette='tertiary' ref={props.setDrawer} mainPalette='surface'
                main={
                    <ErrorBoundary fallback={err => <errors.ErrorHandler err={err} />}>{props.children}</ErrorBoundary>
                }>
                <Menu ref={el => menuRef = el} class={styles.aside} layout='inline'
                    items={buildItems(l, opt.menus)} />
            </Drawer>
        </Match>
    </Switch>;
}
