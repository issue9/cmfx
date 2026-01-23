// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconCode from '~icons/mingcute/code-fill';

import type { Info } from '@docs/components/base';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Scrollable } from './scrollable';
import { default as scrollable } from './scrollable.tsx?raw';

import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.code', icon: IconCode, path: 'code',
        header: import.meta.glob('./HEADER.*.md', { eager: true, query: '?raw' }),
        api: api as Array<Type>, stages: [
            { component: Basic, source: basic, title: '基本功能' },
            { component: Scrollable, source: scrollable, title: '可滚动' },
            { component: Multiple, source: multiple, title: '多行不可滚动' },
        ],
    };
}
