// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Card, cloneElement, MenuItem, MenuItemGroup, Page, useLocale } from '@cmfx/components';
import { ArrayElement, Locale } from '@cmfx/core';
import { A } from '@solidjs/router';
import { For, JSX } from 'solid-js';
import IconPresetComponent from '~icons/iconamoon/component-fill'; // 组件的默认图标

import { Info } from './base';
import styles from './style.module.css';

const demos = import.meta.glob<{ default: () => Info }>('./demo/**/index.tsx', { eager: true });

export const routes: Array<Info> = Object.values(demos).map(d => d.default());

export default function Overview(prefix: string): JSX.Element {
    const l = useLocale();
    const items = buildMenus(l, prefix);

    return <Page class={styles.overview} title={l.t('_d.demo.overview')}>
        <For each={items.filter(item => item.type === 'group')}>
            {group =>
                <fieldset class={styles.group}>
                    <legend>{group.label} <span>{ group.items.length }</span></legend>
                    <For each={group.items}>
                        {item =>
                            <A href={(item as any).value}>
                                <Card header={(item as any).label} class={styles.card}>
                                    <div class={styles.icon}>{cloneElement((item as any).prefix)}</div>
                                </Card>
                            </A>
                        }
                    </For>
                </fieldset>
            }
        </For>
    </Page>;
}

// 生成 Drawer 组件的侧边栏菜单
export function buildMenus(l: Locale, prefix: string): Array<MenuItem<string>> {
    const menus: Array<MenuItem<string>> = [
        { type: 'a', label: l.t('_d.demo.overview'), value: prefix + '/', suffix: routes.length }, // 指向 overview
        { type: 'group', label: l.t('_d.demo.general'), items: [] },
        { type: 'group', label: l.t('_d.demo.layout'), items: [] },
        { type: 'group', label: l.t('_d.demo.navigation'), items: [] },
        { type: 'group', label: l.t('_d.demo.dataInput'), items: [] },
        { type: 'group', label: l.t('_d.demo.dataDisplay'), items: [] },
        { type: 'group', label: l.t('_d.demo.feedback'), items: [] },
        { type: 'group', label: l.t('_d.demo.config'), items: [] },
        { type: 'group', label: l.t('_d.demo.function'), items: [] },
    ];

    const append = (group: MenuItem<string>, r: ArrayElement<typeof routes>) => {
        const p = Array.isArray(r.path) ? r.path[0] : r.path;
        (group as MenuItemGroup<string>).items.push({
            type: 'a',
            label: l.t(r.info?.title),
            value: prefix + p,
            prefix: r.info?.icon ?? <IconPresetComponent />,
        });
    };

    routes.forEach(r => {
        switch (r.kind) {
        case 'general':
            append(menus[1], r);
            break;
        case 'layout':
            append(menus[2], r);
            break;
        case 'navigation':
            append(menus[3], r);
            break;
        case 'data-input':
            append(menus[4], r);
            break;
        case 'data-display':
            append(menus[5], r);
            break;
        case 'feedback':
            append(menus[6], r);
            break;
        case 'config':
            append(menus[7], r);
            break;
        case 'function':
            append(menus[8], r);
            break;
        }
    });

    return menus;
}
