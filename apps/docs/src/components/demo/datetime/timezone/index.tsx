// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconTimezone from '~icons/mdi/timezone';

import type { Info } from '@docs/components/base';

import { default as Timezone } from './timezone';
import { default as timezone } from './timezone.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.timezone', icon: IconTimezone, path: 'datetime/timezone',
        api: api as Array<Type>, stages: [
            { component: Timezone, source: timezone, layout: 'vertical', title: '基本功能' },
        ]
    };
}
