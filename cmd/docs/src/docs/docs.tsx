// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Locale, Menu, MenuItem, MenuItemGroup, useLocale } from '@cmfx/components';
import { ArrayElement } from '@cmfx/core';
import { RouteDefinition } from '@solidjs/router';
import { marked } from 'marked';
import { JSX, ParentProps, createEffect, createMemo, createSignal } from 'solid-js';

import introEN from './intro/intro.en.md?raw';
import introZHHans from './intro/intro.zh-Hans.md?raw';

import usageFAQEN from './usage/faq.en.md?raw';
import usageFAQZHHans from './usage/faq.zh-Hans.md?raw';
import usageInstallEN from './usage/install.en.md?raw';
import usageInstallZHHans from './usage/install.zh-Hans.md?raw';
import usagePlatformEN from './usage/platform.en.md?raw';
import usagePlatformZHHans from './usage/platform.zh-Hans.md?raw';

import advanceLocaleEN from './advance/locale.en.md?raw';
import advanceLocaleZHHans from './advance/locale.zh-Hans.md?raw';
import advanceThemeEN from './advance/theme.en.md?raw';
import advanceThemeZHHans from './advance/theme.zh-Hans.md?raw';

import { markedShiki } from './shiki';

import styles from './style.module.css';

marked.use(markedShiki());

// NOTE: 增删文件，需要同时修改以下几处：
//  - maps
//  - routes

// 外层键名为语言 ID，内层键名为文档 ID，值为文档内容。
const maps: ReadonlyMap<string, ReadonlyMap<string, string>> = new Map([
    ['en', new Map([
        ['intro', introEN],

        ['usage/install', usageInstallEN],
        ['usage/platform', usagePlatformEN],
        ['usage/faq', usageFAQEN],

        ['advance/theme', advanceThemeEN],
        ['advance/locale', advanceLocaleEN]
    ])],
    ['zh-Hans', new Map([
        ['intro', introZHHans],

        ['usage/install', usageInstallZHHans],
        ['usage/platform', usagePlatformZHHans],
        ['usage/faq', usageFAQZHHans],

        ['advance/theme', advanceThemeZHHans],
        ['advance/locale', advanceLocaleZHHans]
    ])],
]);

type Kind = 'intro' | 'usage' | 'advance';

// 定义了所有文章的路由
const routes: Array<RouteDefinition & {kind:Kind, id: string}> = [
    { path: ['/', '/intro'], id: 'intro', kind: 'intro', component: () => <Markdown article='intro' /> },

    { path: '/usage/install', id: 'install', kind: 'usage', component: () => <Markdown article='usage/install' /> },
    { path: '/usage/platform', id: 'platform', kind: 'usage', component: () => <Markdown article='usage/platform' /> },
    { path: '/usage/faq', id: 'faq', kind: 'usage', component: () => <Markdown article='usage/faq' /> },

    { path: '/advance/theme', id: 'theme', kind: 'advance', component: () => <Markdown article='advance/theme' /> },
    { path: '/advance/locale', id: 'locale', kind: 'advance', component: () => <Markdown article='advance/locale' /> },
];

// 生成 Drawer 组件的侧边栏菜单
function buildMenus(l: Locale, prefix: string): Array<MenuItem> {
    const menus: Array<MenuItemGroup> = [
        { type: 'group', label: l.t('_d.docs.intro'), items: [] },
        { type: 'group', label: l.t('_d.docs.usage'), items: [] },
        { type: 'group', label: l.t('_d.docs.advance'), items: [] },
    ];

    const append = (group: MenuItemGroup, r: ArrayElement<typeof routes>) => {
        const p = Array.isArray(r.path) ? r.path[0] : r.path;
        group.items.push({ type: 'item', label: l.t('_d.docs.' + r.id), value: prefix + p });
    };

    routes.forEach(r => {
        switch(r.kind) {
        case 'intro':
            append(menus[0], r);
            break;
        case 'usage':
            append(menus[1], r);
            break;
        case 'advance':
            append(menus[2], r);
            break;
        }
    });

    return menus;
}

const localesID = Array.from(maps.keys());

// 加载 Markdown 文档
//
// article 对应的是 maps 中的文章 ID
function Markdown(props: {article:string}): JSX.Element {
    const l = useLocale();

    // 返回当前语言的文档映射
    const curr = createMemo(() => {
        const id = l.match(localesID);
        return maps.get(id);
    });

    const [html, setHTML] = createSignal(curr()?.get(props.article));

    createEffect(async () => {
        const data = curr()?.get(props.article);
        if (data) { setHTML(await marked.parse(data)); }
    });

    return <article class={styles.doc} innerHTML={html()} />;
}

/**
 * 提供了文档浏览的路由定义
 */
export default function route(prefix: string): RouteDefinition {
    return {
        path: prefix,
        component: (props: ParentProps) => {
            const l = useLocale();

            return <Drawer visible palette='secondary' mainPalette='tertiary' main={props.children}>
                <Menu layout='inline' anchor items={buildMenus(l, prefix)} />
            </Drawer>;
        },
        children: routes
    };
}
