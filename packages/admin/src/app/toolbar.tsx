// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Label, Locale, Menu, TreeItem } from '@cmfx/components';
import { createEffect, createSignal, JSX, Setter, Show, Signal } from 'solid-js';
import IconFullScreen from '~icons/material-symbols/fullscreen';
import IconFullScreenExit from '~icons/material-symbols/fullscreen-exit';
import IconMenu from '~icons/material-symbols/menu';
import IconMenuOpen from '~icons/material-symbols/menu-open';

import { use, useLocale } from '@/context';
import { MenuItem } from '@/options';
import { Hotkey } from '@cmfx/core';
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
    const [, act, opt] = use();

    createEffect(() => {
        if (!opt.aside.floatingMinWidth) { props.menuVisible[1](true); }
    });

    return <header class="app-bar palette--tertiary">
        <div class="title">
            <img alt="logo" class="logo" src={opt.logo} />
            <span class="name">{opt.title}</span>
        </div>

        <div class="menu-icon">
            <Show when={act.isLogin()}>
                <Button icon rounded type="button" kind='flat'
                    classList={{
                        'xs:!hidden': opt.aside.floatingMinWidth == 'xs',
                        'sm:!hidden': opt.aside.floatingMinWidth == 'sm',
                        'md:!hidden': opt.aside.floatingMinWidth == 'md',
                        'lg:!hidden': opt.aside.floatingMinWidth == 'lg',
                        'xl:!hidden': opt.aside.floatingMinWidth == 'xl',
                        '2xl:!hidden': opt.aside.floatingMinWidth == '2xl',
                    }}
                    onClick={() => props.menuVisible[1](!props.menuVisible[0]())}>
                    {props.menuVisible[0]() ? <IconMenuOpen /> : <IconMenu />}
                </Button>
            </Show>
        </div>

        <div class="toolbar">
            <Show when={act.user() ? opt.toolbar.get('search') : false}>
                {(hk) => <Search switch={props.switch} hotkey={hk()} />}
            </Show>
            <Show when={opt.toolbar.get('fullscreen')}>
                {(hk) => fullscreen(hk())}
            </Show>
            <Show when={act.user()}><UserMenu /></Show>
        </div>
    </header>;
}

/**
 * 用户名及其下拉菜单
 */
function UserMenu(): JSX.Element {
    const [, act, opt] = use();
    const l = useLocale();
    const [visible, setVisible] = createSignal(false);

    const activator = <Button class="pl-1 rounded-full"
        onClick={()=>setVisible(!visible())}>
        <img alt='avatar' class="w-6 h-6 rounded-full mr-1" src={ act.user()?.avatar } />
        {act.user()?.name}
    </Button>;

    return <Menu hoverable anchor direction='left' activator={activator}>{buildItems(l, opt.userMenus)}</Menu>;
}

/**
 * 顶部全屏按钮
 */
function fullscreen(hotkey?: Hotkey): JSX.Element {
    const l = useLocale();
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

    return <Button hotkey={hotkey} icon type='button' kind='flat' rounded
        onClick={toggleFullscreen} title={l.t('_c.fullscreen')}>
        {fs() ? <IconFullScreenExit /> : <IconFullScreen />}
    </Button>;
}

export function buildItems(l: Locale, menus: Array<MenuItem>) {
    const items: Array<TreeItem> = [];
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
            const i: TreeItem = {
                type: 'item',
                label: <Label icon={mi.icon}>{l.t(mi.label)}</Label>,
                value: mi.path,
                hotkey: mi.hotkey,
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
