// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconCounter from '~icons/ix/counter';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Formatter } from './formatter';
import { default as formatter } from './formatter.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.counter', icon: <IconCounter /> },
        kind: 'data-display', path: 'counter', component: () =>
            <Stages dir='counter' api={api as Array<Type>} stages={[
                { component: Basic, source: basic, title: 'basic' },
                { component: Formatter, source: formatter, title: 'formatter' },
            ]}>
            </Stages>,
    };
}
