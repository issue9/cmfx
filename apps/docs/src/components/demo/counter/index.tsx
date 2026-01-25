// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCounter from '~icons/ix/counter';

import type { Info } from '@docs/components/base';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Formatter } from './formatter';
import { default as formatter } from './formatter.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.counter', icon: IconCounter, path: 'counter',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Basic, source: basic, title: 'basic' },
            { component: Formatter, source: formatter, title: 'formatter' },
        ]
    };
}
