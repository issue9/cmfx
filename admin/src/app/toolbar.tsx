// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, Setter, Show, Signal } from 'solid-js';

import { Button, Item, Label, Menu } from '@/components';
import { MenuItem, useApp, useOptions } from '@/context';
import { Locale } from '@/core';
import { Search } from './search';

export interface MenuVisibleProps {
    menuVisible: Signal<boolean>;
}

type Props = MenuVisibleProps & {
    // 切换侧边栏菜单的操作
    switch: Setter<string>;
};

/**
 * 顶部工具栏
 */
export default function Toolbar(props: Props) {
    const ctx = useApp();
    const opt = useOptions();

    createEffect(() => {
        if (!opt.asideFloatingMinWidth) { props.menuVisible[1](true); }
    });

    return <header class="app-bar palette--tertiary">
        <div class="title">
            <img alt="logo" class="logo" src={opt.logo} />
            <span class="name">{opt.title}</span>
        </div>

        <div class="menu-icon">
            <Show when={ctx.isLogin()}>
                <Button icon rounded type="button" kind='flat'
                    classList={{
                        'xs:!hidden': opt.asideFloatingMinWidth == 'xs',
                        'sm:!hidden': opt.asideFloatingMinWidth == 'sm',
                        'md:!hidden': opt.asideFloatingMinWidth == 'md',
                        'lg:!hidden': opt.asideFloatingMinWidth == 'lg',
                        'xl:!hidden': opt.asideFloatingMinWidth == 'xl',
                        '2xl:!hidden': opt.asideFloatingMinWidth == '2xl',
                    }}
                    onClick={() => props.menuVisible[1](!props.menuVisible[0]())}>
                    {props.menuVisible[0]() ? 'menu_open' : 'menu'}
                </Button>
            </Show>
        </div>

        <div class="system-bar">
            <Show when={ctx.user()}><Search switch={props.switch} /></Show>
            <Fullscreen />
            <Show when={ctx.user()}><Username /></Show>
        </div>
    </header>;
}

/**
 * 用户名及其下拉菜单
 */
function Username(): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    const [visible, setVisible] = createSignal(false);

    const activator = <Button class="pl-1 rounded-full"
        onClick={()=>setVisible(!visible())}>
        <img alt='avatar' class="w-6 h-6 rounded-full mr-1" src={ ctx.user()?.avatar } />
        {ctx.user()?.name}
    </Button>;

    return <Menu hoverable anchor direction='left' activator={activator}>
        {buildItems(ctx.locale(), opt.userMenus)}
    </Menu>;
}

/**
 * 顶部全屏按钮
 */
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

    return <Button icon type='button' kind='flat' rounded
        onClick={toggleFullscreen} title={ctx.locale().t('_i.fullscreen')}>
        {fs() ? 'fullscreen_exit' : 'fullscreen'}
    </Button>;
}

export function buildItems(l: Locale, menus: Array<MenuItem>) {
    const items: Array<Item> = [];
    menus.forEach((mi) => {
        switch (mi.type) {
        case 'divider':
            items.push({ type: 'divider' });
            break;
        case 'group':
            items.push({
                type: 'group',
                label: l.t(mi.label),
                items: buildItems(l, mi.items),
            });
            break;
        case 'item':
            const i: Item = {
                type: 'item',
                label: <Label icon={mi.icon}>{l.t(mi.label)}</Label>,
                value: mi.path,
            };
            if (mi.items) {
                i.items = buildItems(l, mi.items);
            }

            items.push(i);
            break;
        }
    });

    return items;
}
