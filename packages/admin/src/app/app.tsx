// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, DrawerRef, joinClass, Menu, MenuRef, run, useLocale, Options as XOptions } from '@cmfx/components';
import { API, Config } from '@cmfx/core';
import { Navigate, Router, RouteSectionProps } from '@solidjs/router';
import { createSignal, ErrorBoundary, JSX, Match, onMount, ParentProps, Setter, Switch } from 'solid-js';

import { OptionsProvider, useAdmin, useOptions, useREST } from './context';
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

    const xo: XOptions = {
        config: new Config(opt.id, opt.configName, opt.storage),
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

    const api = await API.build(opt.id+'-token', opt.storage, opt.api.base,
        opt.api.token, opt.api.contentType, opt.api.acceptType, xo.locale!);

    const root = (p: RouteSectionProps) => {
        return <OptionsProvider coreAPI={api} {...opt}>
            <ErrorBoundary fallback={err => <errors.ErrorHandler err={err} />}>
                <div class={joinClass('surface', styles.app)}>
                    <Toolbar drawer={drawerRef} />
                    <main class={styles.main}>{p.children}</main>
                </div>
            </ErrorBoundary>
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
    const act = useAdmin();
    const api = useREST();
    const opt = useOptions();

    onMount(() => {
        if (menuRef) { menuRef.scrollSelectedIntoView(); }
    });

    return <Switch>
        <Match when={!api.api().isLogin()}>
            <Navigate href={/*@once*/opt.routes.public.home} />
        </Match>
        <Match when={act.isLogin()}>
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
