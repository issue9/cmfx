// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, DrawerRef, Menu, useLocale } from '@cmfx/components';
import { RouteDefinition } from '@solidjs/router';
import { onCleanup, onMount, ParentProps, Setter } from 'solid-js';

import { default as overview } from './overview';
import { buildMenus, routes } from './routes';

/**
 * 组件预览的路由定义
 */
export function buildRoute(prefix: string, setDrawer: Setter<DrawerRef | undefined>): RouteDefinition {
    return {
        path: prefix,
        component: (props: ParentProps) => {
            const l = useLocale();

            let ref: DrawerRef;
            onMount(() => { setDrawer(ref); });
            onCleanup(() => setDrawer(undefined));

            return <Drawer visible floating='md' ref={el => ref = el}
                palette='secondary' mainPalette='surface' main={props.children}
            >
                <Menu class="min-w-65" layout='inline' items={buildMenus(l, prefix)} />
            </Drawer>;
        },
        children: [
            { path: '/', component: () => overview(prefix) }, // 指向 overview
            ...routes
        ]
    };
}

export { buildMenus } from './routes';
