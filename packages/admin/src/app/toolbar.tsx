// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, Button, DrawerRef, Dropdown, Locale, MenuItemItem, Search, ToggleFullScreenButton, MenuItem as XMenuItem
} from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { Accessor, JSX, Show } from 'solid-js';
import IconClear from '~icons/material-symbols/delete-rounded';

import { useAdmin, useLocale } from '@/context';
import { clearStorage } from '@/context/context';
import { MenuItem } from '@/options';
import styles from './style.module.css';

/**
 * 顶部工具栏
 */
export default function Toolbar(props: { drawer: Accessor<DrawerRef | undefined>; }) {
    const [, act, opt] = useAdmin();
    const l = useLocale();

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

    return <Appbar palette='tertiary' logo={opt.logo} title={opt.title} class='px-4' actions={
        <>
            <Show when={act.isLogin()}>
                <Show when={opt.toolbar.has('search')}>
                    <Search class={styles.search} icon clear hotkey={opt.toolbar.get('search')}
                        onSearch={v => search(v, buildItems(l, opt.aside.menus))} />
                </Show>
            </Show>
            <Show when={opt.toolbar.has('clear')}>
                <ClearCache hk={opt.toolbar.get('clear')} />
            </Show>
            <Show when={opt.toolbar.has('fullscreen')}>
                <ToggleFullScreenButton hotkey={opt.toolbar.get('fullscreen')} square type='button' kind='flat'
                    title={l.t('_c.fullscreen')} />
            </Show>
            <Show when={act.isLogin()}><UserMenu /></Show>
        </>
    }>
        <Show when={act.isLogin()}>{props.drawer()?.ToggleButton({ square: true })}</Show>
    </Appbar>;
}

function ClearCache(props: { hk?: Hotkey }): JSX.Element {
    const l = useLocale();
    const [api, act, opt] = useAdmin();
    const nav = useNavigate();

    return <Dropdown hotkey={props.hk} trigger='hover' items={[
        { type: 'item', value: 'clear-api-cache', label: l.t('_p.system.clearAPICache') },
        { type: 'item', value: 'clear-storage', label: l.t('_p.system.clearStorage') },
        { type: 'divider' },
        { type: 'item', value: 'clear-all', label: l.t('_p.system.clearAllCache') },
    ]} onChange={async val => {
        switch (val) {
        case 'clear-all':
            await act.clearCache();
            break;
        case 'clear-api-cache':
            await api.api().clearCache();
            break;
        case 'clear-storage':
            await clearStorage(api.api());
            nav(opt.routes.public.home);
            break;
        }
    }}>
        <Button kind='flat' square title={l.t('_p.system.clearCache')}>
            <IconClear />
        </Button>
    </Dropdown>;
}

/**
 * 用户名及其下拉菜单
 */
function UserMenu(): JSX.Element {
    const [, act, opt] = useAdmin();
    const l = useLocale();

    const activator = <Button kind='flat' class="ps-1">
        <img alt='avatar' class={styles.avatar} src={ act.user()?.avatar } />
        {act.user()?.name}
    </Button>;

    return <Dropdown trigger='hover' items={buildItems(l, opt.userMenus)}>
        {activator}
    </Dropdown>;
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
                prefix: mi.icon,
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
