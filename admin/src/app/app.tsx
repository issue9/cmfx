// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A, HashRouter, RouteDefinition, useNavigate } from '@solidjs/router';
import { ErrorBoundary, For, JSXElement } from 'solid-js';
import { render } from 'solid-js/web';

import { XError } from '@/components';
import { Fetcher, sleep } from '@/core';
import { Show } from 'solid-js';
import { Provider, buildContext, notifyColors, useApp, useInternal } from './context';
import { Options, build as buildOptions } from './options';
import { Private } from './private';

export async function create(elementID: string, o: Options) {
    const opt = await buildOptions(o);

    const f = await Fetcher.build(opt.api.base, opt.api.login, opt.mimetype, opt.locales.fallback);

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
            component: ()=>{
                const ctx = useApp();
                return <XError header="404" title={ctx.t('_internal.error.pageNotFound')} home={opt.routes.public.home} />;
            }
        }
    ];

    render(() => {
        const ctx = buildContext(opt, f);
        ctx.title = '';

        const root = (props: { children?: JSXElement }) => (
            <ErrorBoundary fallback={(err)=>(<XError title={err.toString()} />)}>
                <Provider ctx={ctx}>
                    <App>{props.children}</App>
                </Provider>
            </ErrorBoundary>
        );

        return <HashRouter root={root}>
            {routes}
        </HashRouter>;
    }, document.getElementById(elementID)!);
}

function App(props: {children?: JSXElement}) {
    const ctx = useInternal();
    return <div class="flex flex-col box-border overflow-hidden h-dvh bg-surface text-surface">
        <header class="w-dvw p-4 scheme--tertiary flex content-between bg-tertiary text-tertiary">
            <div>
                <img class="inline-block" src={ctx.options.logo} />
                <span class="inline-block ml-2">{ctx.options.title}</span>
            </div>

            <div class="px-4 flex-1 icon-container ml-10">
                toolbar
                <A href="/login" class="material-symbols-outlined">face</A>
            </div>

            <div class="action">action
                <button type="button" class="icon-button--filled scheme--primary">fullscreen</button>
            </div>
        </header>

        <div class="relative">
            <div class="absolute top-4 right-4">
                <For each={ctx.getNotify()}>
                    {item => {
                        const elemID = `notify-${item.id}`;
                        const del = () => {
                            document.getElementById(elemID)!.style.height = '0px';
                            sleep(100).then(() => {
                                ctx.delNotify(item.id);
                            });
                        }

                        if (item.timeout) {
                            sleep(1000 * item.timeout).then(() => {
                                del();
                            });
                        }
                        const color = notifyColors.get(item.type);
                        return <div id={elemID} role="alert" class={`notify scheme--${color}`}>
                            <div class="p-3 flex justify-between icon-container">
                                <p>{item.title}</p>
                                <button onClick={()=>del()} class="material-symbols-outlined hover:cursor-pointer">close</button>
                            </div>
                            <Show when={item.body}>
                                <hr />
                                <p class="p-3">{item.body}</p>
                            </Show>
                        </div >;
                    }}
                </For>
            </div>
            {props.children}
        </div>
    </div>;
}

function Public(props: {children?: JSXElement}) {
    const ctx = useApp();

    if (ctx.isLogin()) {
        const nav = useNavigate();
        nav(ctx.options.routes.private.home);
        return;
    }

    return <div class="p-4 h-dvh flex rounded-lg justify-center overflow-auto">
        {props.children}
    </div>;
}
