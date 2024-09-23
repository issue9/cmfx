// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useNavigate } from '@solidjs/router';
import { Accessor, JSX, Setter, Show, createSignal } from 'solid-js';

import { Button, ItemValue, Menu } from '@/components';
import { Breakpoints } from '@/core';
import { useApp, useOptions } from './context';
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
    const ctx = useApp();
    const opt = useOptions();

    return <header class="app-bar palette--secondary">
        <div class="flex c--icon-container">
            <img alt="logo" class="inline-block max-w-6 max-h-6" src={opt.logo} />
            <span class="inline-block ml-2 text-lg font-bold">{opt.title}</span>
        </div>

        <div class="px-4 flex flex-1 c--icon-container ml-10">
            <Show when={ctx.isLogin() && Breakpoints.compare(ctx.breakpoint(), floatAsideWidth)<0}>
                <Button icon rounded type="button" style='flat' onClick={()=>props.menuVisibleSetter(!props.menuVisibleGetter())}>menu</Button>
            </Show>
        </div>

        <div class="flex gap-2">
            <Fullscreen />

            <Button icon type="button" style='flat' title={ctx.locale().t('_i.settings')} rounded
                onClick={() =>props.settingsVisibleSetter(!props.settingsVisibleGetter())}>
                settings
            </Button>

            <Username />
        </div>
    </header>;
}

function Username(): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    const [visible, setVisible] = createSignal(false);
    const nav = useNavigate();

    const onChange = (select: ItemValue): undefined=>{
        switch(select) {
        case 'logout':
            ctx.logout().finally(()=>{
                nav(opt.routes.public.home);
            });
        }
    };

    const activator = <Button style='flat' onClick={()=>setVisible(!visible())}>{ctx.user()?.name}</Button>;

    return <Show when={ctx.user()?.id}>
        <Menu hoverable direction='left' selectedClass='' activator={activator} onChange={onChange}>{[
            {type: 'divider'},
            {
                type: 'item',
                value: 'logout',
                label: ctx.locale().t('_i.login.logout')
            }
        ]}</Menu>
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

    return <Button icon type="button" style='flat' rounded onClick={toggleFullscreen} title={ctx.locale().t('_i.fullscreen')}>
        {fs() ? 'fullscreen_exit' : 'fullscreen'}
    </Button>;
}
