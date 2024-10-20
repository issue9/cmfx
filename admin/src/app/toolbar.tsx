// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, JSX, Setter, Show, createSignal } from 'solid-js';

import { Button, Menu } from '@/components';
import { compareBreakpoint } from '@/core';
import { useApp, useOptions } from './context';
import { buildItems, floatAsideWidth } from './private';

interface Props {
    menuVisibleGetter: Accessor<boolean>;
    menuVisibleSetter: Setter<boolean>;
}

/**
 * 顶部工具栏
 */
export default function Toolbar(props: Props) {
    const ctx = useApp();
    const opt = useOptions();

    return <header class="app-bar palette--secondary">
        <div class="flex items-center">
            <img alt="logo" class="inline-block max-w-6 max-h-6" src={opt.logo} />
            <span class="inline-block ml-2 text-lg font-bold">{opt.title}</span>
        </div>

        <div class="flex items-center flex-1 mx-4">
            <Show when={ctx.isLogin() && compareBreakpoint(ctx.breakpoint(), floatAsideWidth)<0}>
                <Button icon rounded type="button" kind='flat' onClick={()=>props.menuVisibleSetter(!props.menuVisibleGetter())}>
                    {props.menuVisibleGetter() ? 'menu_open' : 'menu' }
                </Button>
            </Show>
        </div>

        <div class="flex gap-2 items-center">
            <Fullscreen />
            <Username />
        </div>
    </header>;
}

function Username(): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    const [visible, setVisible] = createSignal(false);

    const activator = <Button class="pl-1 rounded-full"
        onClick={()=>setVisible(!visible())}>
        <img class="w-6 h-6 rounded-full" src={ ctx.user()?.avatar ?? opt.logo } />
        {ctx.user()?.name}
    </Button>;

    return <Show when={ctx.user()}>
        <Menu hoverable={/*@once*/true} anchor={/*@once*/true} direction={/*@once*/'left'} selectedClass=''
            activator={activator}>{buildItems(ctx.locale(), opt.userMenus)}</Menu>
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

    return <Button icon={/*@once*/true} type={/*@once*/'button'} kind={/*@once*/'flat'} rounded={/*@once*/true}
        onClick={toggleFullscreen} title={ctx.locale().t('_i.fullscreen')}>
        {fs() ? 'fullscreen_exit' : 'fullscreen'}
    </Button>;
}
