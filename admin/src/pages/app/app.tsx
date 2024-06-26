// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A, HashRouter, RouteDefinition, useNavigate } from '@solidjs/router';
import { ErrorBoundary, For, JSXElement, createContext, useContext } from 'solid-js';
import { render } from 'solid-js/web';

import { XError } from '@/components';
import { buildFetch } from '@/core';
import { buildContext, context } from './context';
import { Options, build as buildOptions } from './options';

type RequiredOptions = Awaited<ReturnType<typeof buildOptions>>;

const internalContext = createContext<RequiredOptions>();

/**
 * 内部使用的全局方法
 */
function useOptions() {
    const ctx = useContext(internalContext);
    if (!ctx) {
        throw '未找到正确的 internalContext';
    }
    return ctx;
}

/**
 * 提供应用内的全局操作方法
 */
export function useApp() {
    const ctx = useContext(context);
    if (!ctx) {
        throw '未找到正确的 context';
    }
    return ctx;
}

export async function create(elementID: string, o: Options) {
    const opt = await buildOptions(o);
    document.title = opt.title;

    const f = await buildFetch(opt.api.base, opt.api.login, opt.mimetype, opt.locales.fallback);
    const ctx = buildContext(opt, f);

    const routes: Array<RouteDefinition> = [
        {
            path: '/',
            component: Public,
            children: opt.routes.public.routes
        },
        {
            path: '/',
            component: Private,
            children: opt.routes.private.routes
        },
        {
            path: '*',
            component: ()=>{return <XError header="404" title={ctx.t('_internal.error.pageNotFound')} home={opt.routes.public.home} />;}
        }
    ];

    render(() => {
        const root = (props: { children?: JSXElement }) => (
            <ErrorBoundary fallback={(err)=>(<XError title={err.toString()} />)}>
                <internalContext.Provider value={opt}>
                    <context.Provider value={ctx}>
                        <App o={opt}>
                            {props.children}
                        </App>
                    </context.Provider>
                </internalContext.Provider>
            </ErrorBoundary>
        );

        return <HashRouter root={root}>
            {routes}
        </HashRouter>;
    }, document.getElementById(elementID)!);
}

function App(props: {o: Awaited<ReturnType<typeof buildOptions>>, children?: JSXElement}) {
    return <div class="flex flex-col box-border overflow-hidden h-dvh">
        <header class="w-dvw p-4 tertiary-color flex content-between">
            <div>
                <img class="inline-block" src={props.o.logo} />
                <span class="inline-block ml-2">{props.o.title}</span>
            </div>

            <div class="px-4 flex-1 icon-container ml-10">
                toolbar
                <A href="/login" class="material-symbols-outlined">face</A>
            </div>

            <div class="action">action
                <button type="button" class="primary-icon-button">fullscreen</button>
            </div>
        </header>
        {props.children}
    </div>;
}

function Public(props: {children?: JSXElement}) {
    const ctx = useApp();
    const i = useOptions();

    if (ctx.isLogin()) {
        const nav = useNavigate();
        nav(i.routes.private.home);
        return;
    }

    return <div class="p-4 surface-color overflow-auto">
        {props.children}
    </div>;
}

function Private(props: {children?: JSXElement}) {
    const ctx = useApp();
    const i = useOptions();

    if (!ctx.isLogin()) {
        const nav = useNavigate();
        nav(i.routes.public.home);
        return;
    }

    return <div class="flex flex-1 overflow-y-hidden">
        <aside class="max-w-32 h-full tertiary-color px-4 pb-4">
            <For each={i.menus}>
                {(item) => (
                    <li>
                        <A href={item.key!}>{ctx.t(item.title as any)}</A>
                    </li>
                )}
            </For>
        </aside>

        <main class=" overflow-y-scroll p-4 rounded-lg surface-color flex-1">
            <ErrorBoundary fallback={(err)=>(<XError title={err.toString()} />)}>
                {props.children}
            </ErrorBoundary>
        </main>
    </div>;
}
