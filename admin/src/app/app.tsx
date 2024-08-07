// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { A, HashRouter, RouteDefinition, useNavigate } from '@solidjs/router';
import { ErrorBoundary, JSX, Show, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { Button, Drawer, Dropdown, Error, IconButton, Item, ItemValue, Menu, Notify } from '@/components';
import { Fetcher, initTheme } from '@/core';
import { buildContext, useApp, useInternal } from './context';
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
    const routes = buildRoutes(opt);
    const f = await Fetcher.build(opt.api.base, opt.api.login, opt.mimetype, opt.locales.fallback);

    render(() => {
        initTheme(opt.theme.mode,opt.theme.scheme, opt.theme.contrast);

        const { ctx, Provider } = buildContext(opt, f); // buildContext 必须在组件内使用！
        ctx.title = '';

        const root = (props: { children?: JSX.Element }) => (
            <ErrorBoundary fallback={(err)=>(
                <Error header={ctx.t('_internal.error.unknownError')} title={err.toString()}>
                    <Button palette='primary' onClick={()=>window.location.reload()}>{ctx.t('_internal.refresh')}</Button>
                </Error>
            )}>
                <Provider><App>{props.children}</App></Provider>
            </ErrorBoundary>
        );

        return <HashRouter root={root}>{routes}</HashRouter>;
    }, document.getElementById(elementID)!);
}

/**
 * 生成适合 hashRouter 的路由项
 */
function buildRoutes(opt: Required<Options>): Array<RouteDefinition> {
    return [
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
                return <Error header="404" title={ctx.t('_internal.error.pageNotFound')}>
                    <div class="flex gap-x-5 justify-center">
                        <A class="palette--primary c--button button-style--fill" href={opt.routes.private.home}>{ ctx.t('_internal.error.backHome') }</A>
                        <Button palette='primary' onClick={() => { useNavigate()(-1); }}>{ ctx.t('_internal.error.backPrev') }</Button>
                    </div>
                </Error>;
            }
        }
    ];
}

/**
* 项目的根组件
*/
function App(props: {children?: JSX.Element}) {
    const ctx = useInternal();
    const [showSettings, setShowSettings] = createSignal(false);

    return <div class="app palette--surface">
        <header class="app-bar palette--secondary">
            <div class="flex icon-container">
                <img alt="logo" class="inline-block max-w-6 max-h-6" src={ctx.options.logo} />
                <span class="inline-block ml-2 text-lg font-bold">{ctx.options.title}</span>
            </div>

            <div class="px-4 flex flex-1 icon-container ml-10">
            </div>

            <div class="flex palette--primary gap-2">
                <Fullscreen />

                <IconButton type="button" style='flat' title={ctx.t('_internal.settings')} rounded
                    onClick={() => setShowSettings(!showSettings()) }>
                    settings
                </IconButton>

                <Username />
            </div>
        </header>

        <main class="app-main">
            <Notify ref={(el)=>ctx.setNotifySender(el)} system={ctx.options.systemNotify} icon={ctx.options.logo} palette='error' />

            <div class="h-full w-full">
                <Drawer pos="right" palette='secondary' main={props.children} floating visible={showSettings()} close={()=>setShowSettings(false)}>
                    <XSetting />
                </Drawer>
            </div>
        </main>
    </div>;
}

function Username(): JSX.Element {
    const ctx = useInternal();
    const [visible, setVisible] = createSignal(false);
    const nav = useNavigate();

    const items: Array<Item> = [
        {type: 'divider'},
        {
            type: 'item',
            value: 'logout',
            label: ctx.t('_internal.logout')
        }
    ];

    const onChange = (select: ItemValue)=>{
        switch(select) {
        case 'logout':
            ctx.fetcher().logout();
            nav(ctx.options.routes.public.home);
        }
        // TODO
    };

    const activator = <Button style='flat' onClick={()=>setVisible(!visible())}>{ctx.user()?.name}</Button>;

    return <Show when={ctx.user()?.id}>
        <Dropdown visible={visible()} setVisible={setVisible}  activator={activator} pos='bottomright'>
            <Menu onChange={onChange}>{ items }</Menu>
        </Dropdown>
    </Show>;
}

function Fullscreen(): JSX.Element {
    const ctx = useApp();

    const [fs, setFS] = createSignal<boolean>(!!document.fullscreenElement);

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }

        document.addEventListener('fullscreenchange', () => { // 有可能浏览器通过其它方式退出全屏。
            setFS(!!document.fullscreenElement);
        });
    };

    return <IconButton type="button" style='flat' rounded onClick={toggleFullscreen} title={ctx.t('_internal.fullscreen')}>
        {fs() ? 'fullscreen_exit' : 'fullscreen'}
    </IconButton>;
}

function Public(props: {children?: JSX.Element}) {
    return <>{props.children}</>;
}
