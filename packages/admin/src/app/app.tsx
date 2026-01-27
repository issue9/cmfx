// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { run } from '@cmfx/components';
import { API, Config } from '@cmfx/core';
import { Navigate, RouteDefinition, Router } from '@solidjs/router';
import { ErrorBoundary, JSX, Match, ParentProps, Switch } from 'solid-js';

import {
    AdminProvider, APIProvider, AppLayout, ErrorHandler, NotFound, OptionsProvider, useAdmin, useOptions
} from './context';
import { build as buildOptions, Options, presetConfigName } from './options';

/**
 * 创建项目
 *
 * @param elementID - 挂载的元素 ID；
 * @param o - 项目的初始化选项；
 * @param router - 指定路由对象，默认值同 {@link run} 中对应的参数；
 */
export async function create(elementID: string, o: Options, router?: typeof Router) {
    const opt = buildOptions(o);

    const routes: Array<RouteDefinition> = [
        {
            path: '/',
            component: props => <>{props.children}</>,
            children: [...opt.routes.public.routes, { path: '*', component: NotFound }]
        },
        {
            path: '/',
            component: props => <Private>{props.children}</Private>,

            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [...opt.routes.private.routes, { path: '*', component: NotFound }]
        }
    ];

    const xo = {
        // 非机密数据，且有固化要求，使用 localStorage 存储，不考虑其它。
        config: new Config(opt.id, presetConfigName, localStorage),
        logo: opt.logo,
        loading: opt.loading,
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

    const root = (p: ParentProps) => {
        return <OptionsProvider {...opt}>
            <APIProvider api={api}>
                <ErrorBoundary fallback={ErrorHandler}>
                    <AdminProvider>{p.children}</AdminProvider>
                </ErrorBoundary>
            </APIProvider>
        </OptionsProvider>;
    };

    run(root, document.getElementById(elementID)!, xo, routes, router);
}

function Private(props: ParentProps): JSX.Element {
    const usr = useAdmin();
    const opt = useOptions();

    return <Switch>
        <Match when={!usr.isLogin()}>
            <Navigate href={opt.routes.public.home} />
        </Match>
        <Match when={usr.isLogin()}>
            <AppLayout>{props.children}</AppLayout>
        </Match>
    </Switch>;
}
