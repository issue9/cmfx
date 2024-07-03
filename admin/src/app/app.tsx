// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, RouteDefinition } from '@solidjs/router';
import { ErrorBoundary, For, JSXElement, Show, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { XDrawer, XError } from '@/components';
import { Fetcher, sleep } from '@/core';
import { Provider, buildContext, notifyColors, useApp, useInternal } from './context';
import { Options, build as buildOptions } from './options';
import { Private } from './private';
import XSetting from './settings';

/**
* 初始化整个项目
*
* @param elementID 挂载的元素 ID；
* @param o 项目的初始化选项；
*/
export async function create(elementID: string, o: Options) {
    const opt = buildOptions(o);

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
        const ctx = buildContext(opt, f); // buildContext 必须在组件内使用！
        ctx.title = '';

        const root = (props: { children?: JSXElement }) => (
            <ErrorBoundary fallback={(err)=>(<XError title={err.toString()} />)}>
                <Provider ctx={ctx}>
                    <App>{props.children}</App>
                </Provider>
            </ErrorBoundary>
        );

        return <HashRouter root={root}>{routes}</HashRouter>;
    }, document.getElementById(elementID)!);
}

/**
* 项目的根组件
*/
function App(props: {children?: JSXElement}) {
    const [fc, setFC] = createSignal<boolean>(!!document.fullscreenElement);
    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }

        document.addEventListener('fullscreenchange', () => { // 有可能浏览器通过其它方式退出全屏。
            setFC(!!document.fullscreenElement);
        });
    };

    const [showSettings, setShowSettings] = createSignal(false);

    const ctx = useInternal();

    return <div class="app">
        <header class="app-bar">
            <div class="flex icon-container">
                <img class="inline-block max-w-6 max-h-6" src={ctx.options.logo} />
                <span class="inline-block ml-2 text-lg font-bold">{ctx.options.title}</span>
            </div>

            <div class="px-4 flex flex-1 icon-container ml-10">
            </div>

            <div class="flex scheme--primary gap-2">
                <button type="button" onClick={toggleFullscreen}
                    title={ctx.t('_internal.fullscreen')}
                    class="icon-button--flat rounded-md">
                    {fc() ? 'fullscreen_exit' : 'fullscreen'}
                </button>

                <Show when={ctx.user()}>
                    <button type="button" onClick={() => setShowSettings(!showSettings()) }
                        title={ctx.t('_internal.settings')} class="icon-button--flat rounded-md">settings</button>
                </Show>
            </div>
        </header>

        <main class="app-main">
            <div class="notify-wrapper">
                <For each={ctx.getNotify()}>
                    {item => {
                        const elemID = `notify-${item.id}`;

                        const del = () => { // 删除通知，并通过改变 height 触发动画效果。
                            const elem = document.getElementById(elemID);
                            if (!elem) { // 已经删除
                                return;
                            }

                            elem!.style.height = '0px';
                            sleep(100).then(() => { ctx.delNotify(item.id); });
                        };

                        if (item.timeout) { // 存在自动删除功能
                            sleep(1000 * item.timeout).then(() => { del(); });
                        }
                        const color = notifyColors.get(item.type);
                        return <div id={elemID} role="alert" class={`notify scheme--${color}`}>
                            <div class="title">
                                <p>{item.title}</p>
                                <button onClick={()=>del()} class="close">close</button>
                            </div>
                            <Show when={item.body}>
                                <hr />
                                <p class="p-3">{item.body}</p>
                            </Show>
                        </div>;
                    }}
                </For>
            </div>

            <div class="h-full w-full">
                <XDrawer pos="right" aside={<XSetting />} show={showSettings()}>
                    {props.children}
                </XDrawer  >
            </div>
        </main>
    </div>;
}

function Public(props: {children?: JSXElement}) {
    return <>
        {props.children}
    </>;
}
