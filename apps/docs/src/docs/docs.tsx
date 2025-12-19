// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    Drawer, DrawerRef, Nav, Menu, MenuItem, MenuItemGroup, Page, useLocale, NavRef, MenuRef
} from '@cmfx/components';
import { ArrayElement, Locale } from '@cmfx/core';
import { RouteDefinition, useCurrentMatches } from '@solidjs/router';
import { Marked } from 'marked';
import { JSX, ParentProps, Setter, createEffect, createMemo, createSignal, onMount, onCleanup } from 'solid-js';

import introChangeLog from '../../../../CHANGELOG.md?raw';
import introReadme from '../../../../README.md?raw';

import usageFAQEN from './usage/faq.en.md?raw';
import usageFAQZHHans from './usage/faq.zh-Hans.md?raw';
import usageInstallEN from './usage/install.en.md?raw';
import usageInstallZHHans from './usage/install.zh-Hans.md?raw';
import usagePlatformEN from './usage/platform.en.md?raw';
import usagePlatformZHHans from './usage/platform.zh-Hans.md?raw';
import usageThemeEN from './usage/theme.en.md?raw';
import usageThemeZHHans from './usage/theme.zh-Hans.md?raw';
import usageSvgEN from './usage/svg.en.md?raw';
import usageSvgZHHans from './usage/svg.zh-Hans.md?raw';

import advanceLocaleEN from './advance/locale.en.md?raw';
import advanceLocaleZHHans from './advance/locale.zh-Hans.md?raw';
import advancePluginsEN from './advance/plugins.en.md?raw';
import advancePluginsZHHans from './advance/plugins.zh-Hans.md?raw';
import advanceCustomThemeEN from './advance/custom-theme.en.md?raw';
import advanceCustomThemeZHHans from './advance/custom-theme.zh-Hans.md?raw';

import { markedShiki } from './shiki';

import styles from './style.module.css';

const markedHiglight = new Marked(markedShiki());

// NOTE: 增删文件，需要同时修改以下几处：
//  - maps
//  - routes

// 外层键名为语言 ID，内层键名为文档 ID，值为文档内容。
const maps: ReadonlyMap<string, ReadonlyMap<string, string>> = new Map([
    ['en', new Map([
        ['intro/readme', introReadme],
        ['intro/changelog', introChangeLog],

        ['usage/install', usageInstallEN],
        ['usage/platform', usagePlatformEN],
        ['usage/faq', usageFAQEN],
        ['usage/theme', usageThemeEN],
        ['usage/svg', usageSvgEN],

        ['advance/locale', advanceLocaleEN],
        ['advance/plugins', advancePluginsEN],
        ['advance/custom-theme', advanceCustomThemeEN]
    ])],
    ['zh-Hans', new Map([
        ['intro/readme', introReadme],
        ['intro/changelog', introChangeLog],

        ['usage/install', usageInstallZHHans],
        ['usage/platform', usagePlatformZHHans],
        ['usage/faq', usageFAQZHHans],
        ['usage/theme', usageThemeZHHans],
        ['usage/svg', usageSvgZHHans],

        ['advance/locale', advanceLocaleZHHans],
        ['advance/plugins', advancePluginsZHHans],
        ['advance/custom-theme', advanceCustomThemeZHHans]
    ])],
]);

type Kind = 'intro' | 'usage' | 'advance';

// 定义了所有文章的路由
//
// title: 在翻译文件中对应的翻译项 id；
// kind 表示文章类型，用于区分不同类型的文档；
const routes: Array<RouteDefinition & { kind: Kind }> = [
    {
        kind: 'intro',
        path: ['/', '/intro/readme'],
        info: { title: '_d.docs.intro' },
        component: () => <Markdown article='intro/readme' />
    },
    {
        kind: 'intro',
        path: '/intro/changelog',
        info: { title: '_d.docs.changelog' },
        component: () => <Markdown article='intro/changelog' />
    },

    //////////////////// usage

    {
        kind: 'usage',
        path: '/usage/install',
        info: { title: '_d.docs.install' },
        component: () => <Markdown article='usage/install' />
    },
    {
        kind: 'usage',
        path: '/usage/platform',
        info: { title: '_d.docs.platform' },
        component: () => <Markdown article='usage/platform' />
    },
    {
        kind: 'usage',
        path: '/usage/svg',
        info: { title: '_d.docs.svg' },
        component: () => <Markdown article='usage/svg' />
    },
    {
        kind: 'usage',
        path: '/usage/theme',
        info: { title: '_d.docs.theme' },
        component: () => <Markdown article='usage/theme' />
    },
    {
        kind: 'usage',
        path: '/usage/faq',
        info: { title: '_d.docs.faq' },
        component: () => <Markdown article='usage/faq' />
    },

    //////////////////// advance

    {
        kind: 'advance',
        path: '/advance/locale',
        info: { title: '_d.docs.locale' },
        component: () => <Markdown article='advance/locale' />
    },
    {
        kind: 'advance',
        path: '/advance/plugins',
        info: { title: '_d.docs.plugins' },
        component: () => <Markdown article='advance/plugins' />
    },
    {
        kind: 'advance',
        path: '/advance/custom-theme',
        info: { title: '_d.docs.customTheme' },
        component: () => <Markdown article='advance/custom-theme' />
    },

] as const;

// 生成 Drawer 组件的侧边栏菜单
export function buildMenus(l: Locale, prefix: string): Array<MenuItem<string>> {
    const menus: Array<MenuItemGroup<string>> = [
        { type: 'group', label: l.t('_d.docs.intro'), items: [] },
        { type: 'group', label: l.t('_d.docs.usage'), items: [] },
        { type: 'group', label: l.t('_d.docs.advance'), items: [] },
    ];

    const append = (group: MenuItemGroup<string>, r: ArrayElement<typeof routes>) => {
        const p = Array.isArray(r.path) ? r.path[0] : r.path;
        group.items.push({ type: 'a', label: l.t(r.info?.title), value: prefix + p });
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
// article 对应的是 maps 中的文章 ID；
function Markdown(props: { article: string }): JSX.Element {
    const l = useLocale();

    // 返回当前语言的文档映射
    const curr = createMemo(() => { return maps.get(l.match(localesID)); });

    const [html, setHTML] = createSignal(curr()?.get(props.article));

    const route = useCurrentMatches()();
    const title = route[route.length - 1].route.info?.title;

    let articleRef: HTMLElement;
    let navRef: NavRef;

    createEffect(async () => {
        const data = curr()?.get(props.article);
        if (data) {
            setHTML(await markedHiglight.parse(data));
            navRef.refresh();
        }
    });

    return <Page title={title} class={styles.docs}>
        <article ref={el => articleRef = el} class={styles.doc} innerHTML={html()} />
        <Nav minHeaderCount={5} class={styles.nav} ref={el => navRef = el} target={articleRef!} query='h2,h3,h4,h5,h6' />
    </Page>;
}

/**
 * 提供了文档浏览的路由定义
 */
export function buildRoute(prefix: string, setDrawer: Setter<DrawerRef | undefined>): RouteDefinition {
    return {
        path: prefix,
        component: (props: ParentProps) => {
            const l = useLocale();
            let menuRef: MenuRef;

            let ref: DrawerRef;
            onMount(() => {
                setDrawer(ref);
                menuRef.scrollSelectedIntoView();
            });
            onCleanup(() => setDrawer(undefined));

            return <Drawer visible floating='xs' ref={el => ref = el}
                palette='secondary' mainPalette='surface' main={props.children}
            >
                <Menu ref={el => menuRef = el} class="min-w-60" layout='inline' items={buildMenus(l, prefix)} />
            </Drawer>;
        },
        children: routes
    };
}
