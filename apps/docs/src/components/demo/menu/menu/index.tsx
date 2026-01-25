// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconMenu from '~icons/bi/menu-down';

import type { Info } from '@docs/components/base';

import { default as Layout } from './layout';
import { default as layout } from './layout.tsx?raw';

import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

import { default as Anchor } from './anchor';
import { default as anchor } from './anchor.tsx?raw';

export default function(): Info {
    return {
        kind: 'navigation', title: '_d.demo.menu', icon: IconMenu, path: 'menu/menu',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Layout, source: layout, title: '布局' },
            { component: Multiple, source: multiple, title: '多选' },
            { component: Anchor, source: anchor, title: '链接' },
        ]
    };
}
