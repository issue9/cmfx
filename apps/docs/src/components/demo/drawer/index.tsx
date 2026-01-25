// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDrawer from '~icons/ri/archive-drawer-fill';

import type { Info } from '@docs/components/base';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Float } from './float';
import { default as float } from './float.tsx?raw';

export default function(): Info {
    return {
        kind: 'layout', title: '_d.demo.drawer', icon: IconDrawer, path: 'drawer',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Basic, source: basic, title: 'basic' },
            { component: Float, source: float, title: 'float' },
        ]
    };
}
