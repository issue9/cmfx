// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { Accessor, JSX, Setter, Show, createSignal } from 'solid-js';

import { Button, Dropdown, ItemValue, Menu } from '@/components';
import { Breakpoints } from '@/core';
import { useApp, useInternal } from './context';
import { floatAsideWidth } from './private';

interface Props {
    settingsVisibleGetter: Accessor<boolean>;
    settingsVisibleSetter: Setter<boolean>;
    menuVisibleGetter: Accessor<boolean>;
    menuVisibleSetter: Setter<boolean>;
}

/**
 * 顶部工具栏
 */
export default function Toolbar(props: Props) {
    const ctx = useInternal();

    return <header class="app-bar palette--secondary">
        <div class="flex c--icon-container">
            <img alt="logo" class="inline-block max-w-6 max-h-6" src={ctx.options.logo} />
            <span class="inline-block ml-2 text-lg font-bold">{ctx.options.title}</span>
        </div>

        <div class="px-4 flex flex-1 c--icon-container ml-10">
            <Show when={ctx.isLogin() && Breakpoints.compare(ctx.breakpoint(), floatAsideWidth)<0}>
                <Button icon rounded type="button" style='flat' onClick={()=>props.menuVisibleSetter(!props.menuVisibleGetter())}>menu</Button>
            </Show>
        </div>

        <div class="flex gap-2">
            <Fullscreen />

            <Button icon type="button" style='flat' title={ctx.t('_internal.settings')} rounded
                onClick={() =>props.settingsVisibleSetter(!props.settingsVisibleGetter())}>
                settings
            </Button>

            <Username />
        </div>
    </header>;
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
        <Dropdown visible={visible()} setVisible={setVisible}  activator={activator} pos='bottomright' class="z-[2000]">
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
