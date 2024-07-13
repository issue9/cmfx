// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A, HashRouter, RouteDefinition, useNavigate } from '@solidjs/router';
import { ErrorBoundary, JSXElement, Show, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { XButton, XDrawer, XError, XIconButton, XNotify } from '@/components';
import { Fetcher } from '@/core';
import { Provider, buildContext, useApp, useInternal } from './context';
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
                return <XError header="404" title={ctx.t('_internal.error.pageNotFound')}>
                    <div class="flex gap-x-5 justify-center">
                        <A class="scheme--primary button filled" href={opt.routes.private.home}>{ ctx.t('_internal.error.backHome') }</A>
                        <XButton scheme='primary' onClick={() => { useNavigate()(-1); }}>{ ctx.t('_internal.error.backPrev') }</XButton>
                    </div>
                </XError>;
            }
        }
    ];

    render(() => {
        const ctx = buildContext(opt, f); // buildContext 必须在组件内使用！
        ctx.title = '';

        const root = (props: { children?: JSXElement }) => (
            <ErrorBoundary fallback={(err)=>(
                <XError header={ctx.t('_internal.error.unknownError')} title={err.toString()}>
                    <XButton scheme='primary' onClick={()=>window.location.reload()}>{ctx.t('_internal.refresh')}</XButton>
                </XError>
            )}>
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
                <XIconButton type="button" style="flated" rounded onClick={toggleFullscreen}title={ctx.t('_internal.fullscreen')}>
                    {fc() ? 'fullscreen_exit' : 'fullscreen'}
                </XIconButton>

                <Show when={ctx.user()}>
                    <XIconButton type="button" style='flated' rounded onClick={() => setShowSettings(!showSettings()) } title={ctx.t('_internal.settings')}>
                        settings
                    </XIconButton>
                </Show>
            </div>
        </header>

        <main class="app-main">
            <XNotify ref={(el)=>ctx.setNotifySender(el)} system={ctx.options.systemNotify} icon={ctx.options.logo} scheme='error' />

            <div class="h-full w-full">
                <XDrawer pos="right" scheme='secondary' aside={<XSetting />} floating visible={showSettings()} close={()=>setShowSettings(false)}>
                    {props.children}
                </XDrawer>
            </div>
        </main>
    </div>;
}

function Public(props: {children?: JSXElement}) {
    return <>
        {props.children}
    </>;
}
