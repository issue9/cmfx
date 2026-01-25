// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconResult from '~icons/stash/search-results';

import type { Info } from '@docs/components/base';

import { default as H } from './horizontal';
import { default as h } from './horizontal.tsx?raw';

import { default as V } from './vertical';
import { default as v } from './vertical.tsx?raw';

import { default as Auto } from './auto';
import { default as auto } from './auto.tsx?raw';

import { default as Empty } from './empty';
import { default as empty } from './empty.tsx?raw';

import { default as Custom } from './custom-empty';
import { default as custom } from './custom-empty.tsx?raw';

export default function(): Info {
    return {
        kind: 'feedback', title: '_d.demo.result', icon: IconResult, path: 'result',
        header: import.meta.glob('./HEADER.*.md', { eager: true, query: '?raw', import: 'default' }),
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: H, source: h, title: 'horizontal' },
            { component: V, source: v, title: 'vertical' },
            { component: Auto, source: auto, title: 'auto' },
            { component: Empty, source: empty, height: '250px', title: 'empty' },
            { component: Custom, source: custom, height: '300px', title: 'custom-empty' },
        ]
    };
}
