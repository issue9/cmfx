// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconStatistic from '~icons/octicon/number-16';

import type { Info } from '@docs/components/base';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.statistic', icon: IconStatistic, path: 'statistic',
        api: api as Array<Type>, stages: [
            { component: Basic, source: basic, title: 'basic' },
        ]
    };
}
