// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Appbar, Button, DrawerRef, Dropdown, DropdownRef, fieldAccessor,
    Locale, MenuItemItem, TextField, ToggleFullScreenButton, MenuItem as XMenuItem
} from '@cmfx/components';
import { Accessor, createSignal, JSX, Show } from 'solid-js';
import IconClear from '~icons/material-symbols/close';
import IconSearch from '~icons/material-symbols/search';

import { useAdmin, useLocale } from '@/context';
import { MenuItem } from '@/options';
import styles from './style.module.css';

/**
 * 顶部工具栏
 */
export default function Toolbar(props: { drawer: Accessor<DrawerRef | undefined>; }) {
    const [, act, opt] = useAdmin();
    const l = useLocale();

    const [candidate, setCandidate] = createSignal<Array<MenuItemItem<string>>>([]);
    let dropdownRef: DropdownRef;
    const searchFA = fieldAccessor('search', '');
    searchFA.onChange(value => {
        const items: Array<MenuItemItem<string>> = [];
        const menus = buildItems(l, opt.aside.menus);

        for (const m of menus) {
            if (m.type === 'a' && m.label && (m.label as string).toLowerCase().includes(value.toLowerCase())) {
                items.push({ type: 'a', value: m.value, label: m.label });
            } else if (m.type === 'group' && m.items) {
                // 目前只有两级菜单
                for (const mm of m.items) {
                    if (mm.type === 'a' && mm.label && (mm.label as string).toLowerCase().includes(value.toLowerCase())) {
                        items.push({ type: 'a', value: mm.value, label: mm.label });
                    }
                }
            }
        }

        setCandidate(items);
        if (items.length > 0) { dropdownRef.show(); }
    });

    return <Appbar palette='tertiary' logo={opt.logo} title={opt.title} class='px-4' actions={
        <>
            <Show when={act.user() ? opt.toolbar.get('search') : undefined}>
                {hk =>
                    (<Dropdown class="w-60 self-center" trigger='custom' items={candidate()} ref={el => {
                        dropdownRef = el;
                        dropdownRef.menu().element().style.height = '240px';
                        dropdownRef.menu().element().style.overflowY = 'auto';
                    }} onPopover={visible => {
                        if (visible) {
                            dropdownRef.menu().element().style.width
                                = dropdownRef.element().getBoundingClientRect().width + 'px';
                        }
                        return false;
                    }}>
                        <TextField placeholder={l.t('_c.search')} accessor={searchFA}
                            prefix={<IconSearch class={styles['search-icon']} />}
                            suffix={
                                <Show when={searchFA.getValue()}>
                                    <IconClear onclick={() => searchFA.setValue('')} class={styles['search-clear']} />
                                </Show>
                            }
                        />
                    </Dropdown>)
                }
            </Show>
            <Show when={opt.toolbar.get('fullscreen')}>
                {hk =>
                    <ToggleFullScreenButton square type='button' kind='flat'
                        rounded title={l.t('_c.fullscreen')} />
                }
            </Show>
            <Show when={act.user()}><UserMenu /></Show>
        </>
    }>
        <Show when={act.isLogin()}>{props.drawer()?.ToggleButton()}</Show>
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
