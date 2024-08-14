// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter, RouteDefinition, useNavigate } from '@solidjs/router';
import { JSX, Show, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { Button, Drawer, Dropdown, ItemValue, Menu, Notify, SystemDialog } from '@/components';
import { Fetcher, initTheme } from '@/core';
import { buildContext, useApp, useInternal } from './context';
import * as errors from './errors';
import { Options, build as buildOptions } from './options';
import { Private } from './private';
import XSetting from './settings';

/**
 * 初始化整个项目
 *
 * @param elementID 挂载的元素 ID，用户需要在该元素上指定高和宽，如果要占满页面可以用 100dvh 和 100dvw；
 * @param o 项目的初始化选项；
 */
export async function create(elementID: string, o: Options) {
    const opt = buildOptions(o);
    const routes = buildRoutes(opt);
    const f = await Fetcher.build(opt.api.base, opt.api.login, opt.mimetype, opt.locales.fallback);

    render(() => {
        initTheme(opt.theme.mode,opt.theme.scheme, opt.theme.contrast);

        const { Provider } = buildContext(opt, f); // buildContext 必须在组件内使用！

        const root = (props: { children?: JSX.Element }) => (
            <Provider><App>{props.children}</App></Provider>
        );

        return <HashRouter root={root}>{routes}</HashRouter>;
    }, document.getElementById(elementID)!);
}

/**
 * 生成适合 HashRouter 的路由项
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
            // 所有的 404 都将会在 children 中匹配 *，如果是未登录，则在匹配之后跳转到登录页。
            children: [ ...opt.routes.private.routes, { path:'*', component: errors.NotFound } ]
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
        <Show when={ctx.options.system.dialog}>
            <SystemDialog header={ctx.options.title} palette='surface' />
        </Show>
        <header class="app-bar palette--secondary">
            <div class="flex icon-container">
                <img alt="logo" class="inline-block max-w-6 max-h-6" src={ctx.options.logo} />
                <span class="inline-block ml-2 text-lg font-bold">{ctx.options.title}</span>
            </div>

            <div class="px-4 flex flex-1 icon-container ml-10">
            </div>

            <div class="flex palette--primary gap-2">
                <Fullscreen />

                <Button icon type="button" style='flat' title={ctx.t('_internal.settings')} rounded
                    onClick={() => setShowSettings(!showSettings()) }>
                    settings
                </Button>

                <Username />
            </div>
        </header>

        <main class="app-main">
            <Notify ref={(el)=>ctx.setNotifySender(el)} palette='error' />

            <div class="h-full w-full">
                <Drawer pos="right" palette='secondary' main={props.children} floating
                    visible={showSettings()} close={()=>setShowSettings(false)}>
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

    const onChange = async(select: ItemValue)=>{
        switch(select) {
        case 'logout':
            await ctx.logout();
            nav(ctx.options.routes.public.home);
        }
    };

    const activator = <Button style='flat' onClick={()=>setVisible(!visible())}>{ctx.user()?.name}</Button>;

    return <Show when={ctx.user()?.id}>
        <Dropdown visible={visible()} setVisible={setVisible}  activator={activator} pos='bottomright'>
            <Menu selectedClass='' onChange={onChange}>{[
                {type: 'divider'},
                {
                    type: 'item',
                    value: 'logout',
                    label: ctx.t('_internal.login.logout')
                }
            ]}</Menu>
        </Dropdown>
    </Show>;
}

function Fullscreen(): JSX.Element {
    const ctx = useApp();

    const [fs, setFS] = createSignal<boolean>(!!document.fullscreenElement);

    const toggleFullscreen = async() => {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else {
            await document.body.requestFullscreen();
        }

        document.addEventListener('fullscreenchange', () => { // 有可能浏览器通过其它方式退出全屏。
            setFS(!!document.fullscreenElement);
        });
    };

    return <Button icon type="button" style='flat' rounded onClick={toggleFullscreen} title={ctx.t('_internal.fullscreen')}>
        {fs() ? 'fullscreen_exit' : 'fullscreen'}
    </Button>;
}

function Public(props: {children?: JSX.Element}) {
    return <>{props.children}</>;
}
