// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, Menu, useLocale } from '@cmfx/components';
import { RouteDefinition } from '@solidjs/router';
import { ParentProps } from 'solid-js';

import { default as overview } from './overview';
import { buildMenus, routes } from './routes';

/**
 * 组件预览的路由定义
 */
export default function route(prefix: string): RouteDefinition {
    return {
        path: prefix,
        component: (props: ParentProps) => {
            const l = useLocale();
            return <Drawer visible palette='secondary' mainPalette='surface' main={props.children}>
                <Menu class="min-w-65" layout='inline' items={buildMenus(l, prefix)} />
            </Drawer>;
        },
        children: [
            { path: '/', component: () => overview(prefix) }, // 指向 overview
            ...routes
        ]
    };
}
