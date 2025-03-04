// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, JSX, Show, Signal } from 'solid-js';

import {
    Button, Dialog, DialogRef, FieldAccessor, Icon, Item, Label,
    List, Menu, MenuItem, TextField, useApp, useOptions
} from '@/components';
import { Locale } from '@/core';

export interface MenuVisibleProps {
    menuVisible: Signal<boolean>;
}

/**
 * 顶部工具栏
 */
export default function Toolbar(props: MenuVisibleProps) {
    const ctx = useApp();
    const opt = useOptions();

    createEffect(() => {
        if (!opt.asideFloatingMinWidth) { props.menuVisible[1](true); }
    });
    
    return <header class="app-bar palette--secondary">
        <div class="flex items-center">
            <img alt="logo" class="inline-block max-w-6 max-h-6" src={opt.logo} />
            <span class="inline-block ml-2 text-lg font-bold">{opt.title}</span>
        </div>

        <div class="flex items-center flex-1 mx-4">
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

        <div class="flex gap-2 items-center">
            <Show when={ctx.user()}><Search /></Show>
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

/**
 * 顶部搜索框
 */
function Search(): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    let dlgRef: DialogRef;
    const [items, setItems] = createSignal<Array<Item>>(buildItemsWithSearch(ctx.locale(), opt.menus, ''));
    
    const input = FieldAccessor('search', '', false);
    input.onChange((val: string) => {
        setItems(buildItemsWithSearch(ctx.locale(), opt.menus, val));
    });

    const showSearch = () => {
        input.setValue('');
        dlgRef.showModal();
    };

    return <>
        <Dialog ref={el => dlgRef = el} class="app-search" actions={
            <div class="w-full">
                <div class="w-full text-left" innerHTML={ctx.locale().t('_i.app.keyDesc')}></div>
            </div>
        }>
            <TextField class='mb-3 border-0' accessor={input} placeholder={ctx.locale().t('_i.app.searchAtSidebar')} suffix={
                <Show when={input.getValue() !== ''}>
                    <Icon icon='close' class="!flex !items-center cursor-pointer mr-1" onClick={() => input.setValue('')} />
                </Show>
            } prefix={
                <Icon icon='search' class="!flex !items-center ms-1" />
            } />

            <div class="list"><List onChange={(selected)=>{
                dlgRef.close('');
                ctx.navigate()(selected as string);
            }}>{items()}</List></div>
        </Dialog>

        <Button icon type='button' kind='flat' rounded
            title={ctx.locale().t('_i.search')}
            onClick={showSearch}>search</Button>
    </>;
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
                accesskey: mi.accesskey,
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

export function buildItemsWithSearch(l: Locale, menus: Array<MenuItem>, search: string) {
    const items: Array<Item> = [];

    if (!search) {
        return items;
    }

    menus.forEach((mi) => {
        switch (mi.type) {
        case 'divider':
            return;
        case 'group':
            const c = buildItemsWithSearch(l, mi.items, search);
            if (c.length > 0) {
                items.push(...c);
            }
            break;
        case 'item':
            if (mi.items && mi.items.length > 0) {
                const cc = buildItemsWithSearch(l, mi.items, search);
                if (cc.length > 0) {
                    items.push(...cc);
                }
            } else {
                const label = l.t(mi.label);
                if (label.includes(search)) {
                    items.push({
                        type: 'item',
                        label: <Label icon={mi.icon}>{label}</Label>,
                        value: mi.path,
                    });
                }
            }
            break;
        }
    });

    return items;
}
