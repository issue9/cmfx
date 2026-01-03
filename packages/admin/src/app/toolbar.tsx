// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, Button, DrawerRef, Dropdown, MenuItemItem, Palette, Search,
    ToggleFullScreenButton, MenuItem as XMenuItem, useLocale, useOptions
} from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { Accessor, For, JSX, Show } from 'solid-js';
import IconClear from '~icons/material-symbols/delete-rounded';

import { useAPI, useAdmin, useOptions as useAdminOptions } from './context';
import { ToolbarItem, buildItems } from './options';
import styles from './style.module.css';

/**
 * 创建一个用于工具栏上的全屏按钮项
 *
 * @param hk - 快捷键；
 */
export function createFullscreen(hk?: Hotkey): ToolbarItem {
    const c = () => {
        const l = useLocale();
        return <ToggleFullScreenButton hotkey={hk} square type='button' kind='flat'
            title={l.t('_c.fullscreen')} />;
    };
    return [true, c];
}

/**
 * 创建一个用于工具栏上的清除菜单项
 *
 * @param hk - 快捷键；
 */
export function createClear(hk?: Hotkey): ToolbarItem {
    const c = () => {
        const l = useLocale();
        const api = useAPI();
        const usr = useAdmin();
        const opt = useAdminOptions();
        const nav = useNavigate();
        const [set] = useOptions();

        return <Dropdown selectedClass='' hotkey={hk} trigger='hover' items={[
            { type: 'item', value: 'clear-api-cache', label: l.t('_p.system.clearAPICache') },
            { type: 'item', value: 'clear-storage', label: l.t('_p.system.clearStorage') },
            { type: 'divider' },
            { type: 'item', value: 'clear-all', label: l.t('_p.system.clearAllCache') },
        ]} onChange={async val => {
            switch (val) {
            case 'clear-all':
                await api.clearCache();
                await usr.logout();
                set.clearStorage();
                nav(opt.routes.public.home);
                break;
            case 'clear-api-cache':
                await api.clearCache();
                break;
            case 'clear-storage':
                await usr.logout(); // 清除存储在 storage 中的登录信息
                set.clearStorage();
                nav(opt.routes.public.home);
                break;
            }
        }}>
            <Button kind='flat' square title={l.t('_p.system.clearCache')}><IconClear /></Button>
        </Dropdown>;
    };

    return [true, c];
}

/**
 * 创建一个用于工具栏上的搜索框
 *
 * @param hk - 工具栏；
 */
export function createSearch(hk?: Hotkey): ToolbarItem {
    const search = async (value: string, menus: Array<XMenuItem<string>>): Promise<Array<MenuItemItem<string>>> => {
        const items: Array<MenuItemItem<string>> = [];

        for (const m of menus) {
            if (m.type === 'a' && m.items && m.items.length > 0) {
                items.push(...await search(value, m.items));
            } else if (m.type === 'a' && m.label && (m.label as string).toLowerCase().includes(value.toLowerCase())) {
                items.push({ type: 'a', value: m.value, label: m.label });
            } else if (m.type === 'group' && m.items && m.items.length > 0) {
                items.push(...await search(value, m.items));
            }
        }

        return items;
    };

    const c = () => {
        const opt = useAdminOptions();
        const l = useLocale();

        return <Search class={styles.search} icon clear hotkey={hk}
            onSearch={v => search(v, buildItems(l, opt.menus))} />;
    };
    return [false, c];
}

interface ToolbarProps {
    drawer: Accessor<DrawerRef | undefined>;
    showTitle?: boolean;
    palette?: Palette;
}

/**
 * 顶部工具栏
 */
export default function Toolbar(props: ToolbarProps) {
    const usr = useAdmin();
    const opt = useAdminOptions();

    return <Appbar logo={props.showTitle ? opt.logo : undefined} title={props.showTitle ? opt.title : undefined}
        class='px-4' palette={props.palette} actions={
            <>
                <For each={opt.toolbar}>
                    {item => {
                        const [pub, C] = item;
                        return <Show when={pub || usr.isLogin()}>
                            <C />
                        </Show>;
                    }}
                </For>
                <Show when={usr.isLogin()}><UserMenu /></Show>
            </>
        }>
        {props.drawer()?.ToggleButton({ square: true })}
    </Appbar>;
}

/**
 * 用户名及其下拉菜单
 */
function UserMenu(): JSX.Element {
    const opt = useAdminOptions();
    const usr = useAdmin();
    const l = useLocale();

    const activator = <Button kind='flat' class="ps-1">
        <img alt='avatar' class={styles.avatar} src={ usr.info()?.avatar } />
        {usr.info()?.name}
    </Button>;

    return <Dropdown trigger='hover' items={buildItems(l, opt.userMenus)}>
        {activator}
    </Dropdown>;
}
