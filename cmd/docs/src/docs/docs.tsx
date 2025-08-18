// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Locale, Menu, MenuItem, useLocale } from '@cmfx/components';
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
//  - buildMenus

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

// 定义了所有文章的路由
const routes: Array<RouteDefinition> = [
    { path: ['/', '/intro'], component: () => <Markdown article='intro' /> },

    { path: '/usage/install', component: () => <Markdown article='usage/install' /> },
    { path: '/usage/platform', component: () => <Markdown article='usage/platform' /> },
    { path: '/usage/faq', component: () => <Markdown article='usage/faq' /> },

    { path: '/advance/theme', component: () => <Markdown article='advance/theme' /> },
    { path: '/advance/locale', component: () => <Markdown article='advance/locale' /> },
];

// 生成 Drawer 组件的侧边栏菜单
function buildMenus(l: Locale, prefix: string): Array<MenuItem> {
    return [
        { type: 'group', label: l.t('_d.docs.intro'), items: [
            { type: 'item', label: 'cmfx', value: prefix + '/intro' },
        ]},

        { type: 'group', label: l.t('_d.docs.usage'), items: [
            { type: 'item', label: l.t('_d.docs.install'), value: prefix + '/usage/install' },
            { type: 'item', label: l.t('_d.docs.platform'), value: prefix + '/usage/platform' },
            { type: 'item', label: l.t('_d.docs.faq'), value: prefix + '/usage/faq' },
        ]},

        { type: 'group', label: l.t('_d.docs.advance'), items: [
            { type: 'item', label: l.t('_d.docs.theme'), value: prefix + '/advance/theme' },
            { type: 'item', label: l.t('_d.docs.locale'), value: prefix + '/advance/locale' },
        ]},

    ];
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
