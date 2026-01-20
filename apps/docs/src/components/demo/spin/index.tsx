// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconSpin from '~icons/pepicons-pop/arrow-spin-circle';

import type { Info } from '@docs/components/base';

import { default as Spin } from './spin';
import { default as spin } from './spin.tsx?raw';

import { default as Indicator } from './indicator';
import { default as indicator } from './indicator.tsx?raw';

import { default as Overlay } from './overlay';
import { default as overlay } from './overlay.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'feedback', title: '_d.demo.spin', icon: IconSpin, path: 'spin',
        api: api as Array<Type>, stages: [
            { component: Spin, source: spin, title: '基本功能' },
            { component: Indicator, source: indicator, title: 'indicator' },
            { component: Overlay, source: overlay, title: 'overlay' },
        ]
    };
}
