// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, Button, classList, Dropdown, Locale, MenuItem as XMenuItem } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { createEffect, createSignal, JSX, onCleanup, onMount, Setter, Show, Signal } from 'solid-js';
import IconFullScreen from '~icons/material-symbols/fullscreen';
import IconFullScreenExit from '~icons/material-symbols/fullscreen-exit';
import IconMenu from '~icons/material-symbols/menu';
import IconMenuOpen from '~icons/material-symbols/menu-open';

import { useAdmin, useLocale } from '@/context';
import { MenuItem } from '@/options';
import { Search } from './search';

export interface MenuVisibleProps {
    menuVisible: Signal<boolean>;
}

type Props = MenuVisibleProps & {
    switch: Setter<string>; // 切换侧边栏菜单的操作
};

/**
 * 顶部工具栏
 */
export default function Toolbar(props: Props) {
    const [, act, opt] = useAdmin();

    createEffect(() => {
        if (!opt.aside.floatingMinWidth) { props.menuVisible[1](true); }
    });

    return <Appbar palette='tertiary' logo={opt.logo} title={opt.title} class='px-4' actions={
        <>
            <Show when={act.user() ? opt.toolbar.get('search') : false}>
                {(hk) => <Search switch={props.switch} hotkey={hk()} />}
            </Show>
            <Show when={opt.toolbar.get('fullscreen')}>
                {(hk) => fullscreen(hk())}
            </Show>
            <Show when={act.user()}><UserMenu /></Show>
        </>
    }>
        <Show when={act.isLogin()}>
            <Button square rounded type="button" kind='flat' class={classList({
                'xs:!hidden': opt.aside.floatingMinWidth == 'xs',
                'sm:!hidden': opt.aside.floatingMinWidth == 'sm',
                'md:!hidden': opt.aside.floatingMinWidth == 'md',
                'lg:!hidden': opt.aside.floatingMinWidth == 'lg',
                'xl:!hidden': opt.aside.floatingMinWidth == 'xl',
                '2xl:!hidden': opt.aside.floatingMinWidth == '2xl',
            })}
            onClick={() => props.menuVisible[1](!props.menuVisible[0]())}>
                {props.menuVisible[0]() ? <IconMenuOpen /> : <IconMenu />}
            </Button>
        </Show>
    </Appbar>;
}

/**
 * 用户名及其下拉菜单
 */
function UserMenu(): JSX.Element {
    const [, act, opt] = useAdmin();
    const l = useLocale();
    const [visible, setVisible] = createSignal(false);

    const activator = <Button rounded class="ps-1"
        onClick={()=>setVisible(!visible())}>
        <img alt='avatar' class="w-6 h-6 rounded-full me-1" src={ act.user()?.avatar } />
        {act.user()?.name}
    </Button>;

    return <Dropdown hoverable items={buildItems(l, opt.userMenus)}>
        {activator}
    </Dropdown>;
}

/**
 * 顶部全屏按钮
 */
function fullscreen(hotkey?: Hotkey): JSX.Element {
    const l = useLocale();
    const [fs, setFS] = createSignal<boolean>(!!document.fullscreenElement);

    // 有可能浏览器通过其它方式控制全屏功能
    const change = () => { setFS(!!document.fullscreenElement); };
    onMount(() => { document.addEventListener('fullscreenchange', change); });
    onCleanup(() => { document.removeEventListener('fullscreenchange', change); });

    const toggleFullscreen = async() => {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else {
            await document.body.requestFullscreen();
        }
    };

    return <Button hotkey={hotkey} square type='button' kind='flat' rounded
        onClick={toggleFullscreen} title={l.t('_c.fullscreen')}>
        {fs() ? <IconFullScreenExit /> : <IconFullScreen />}
    </Button>;
}

export function buildItems(l: Locale, menus: Array<MenuItem>): Array<XMenuItem<string>> {
    const items: Array<XMenuItem<string>> = [];
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
            items.push({
                type: 'a',
                icon: mi.icon,
                label: l.t(mi.label),
                value: mi.path,
                hotkey: mi.hotkey,
                items: mi.items ? buildItems(l, mi.items) : undefined,
                suffix: mi.suffix,
            });
            break;
        }
    });

    return items;
}
