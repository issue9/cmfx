// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, Button, DrawerRef, Dropdown, Locale, MenuItemItem, Search, ToggleFullScreenButton, MenuItem as XMenuItem
} from '@cmfx/components';
import { Accessor, createSignal, JSX, Show } from 'solid-js';

import { useAdmin, useLocale } from '@/context';
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
            <Show when={act.user() ? opt.toolbar.get('search') : undefined}>
                {hk =>
                    <Search class={styles.search} icon clear hotkey={hk()}
                        onSearch={v => search(v, buildItems(l, opt.aside.menus))} />
                }
            </Show>
            <Show when={opt.toolbar.get('fullscreen')}>
                {hk =>
                    <ToggleFullScreenButton hotkey={hk()} square type='button' kind='flat'
                        rounded title={l.t('_c.fullscreen')} />
                }
            </Show>
            <Show when={act.user()}><UserMenu /></Show>
        </>
    }>
        <Show when={act.isLogin()}>{props.drawer()?.ToggleButton({ square: true })}</Show>
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
        onclick={()=>setVisible(!visible())}>
        <img alt='avatar' class="w-6 h-6 rounded-full me-1" src={ act.user()?.avatar } />
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
