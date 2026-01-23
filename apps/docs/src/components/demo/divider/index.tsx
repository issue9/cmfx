// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDivider from '~icons/pixel/divider-solid';

import type { Info } from '@docs/components/base';

import { default as Divider } from './divider';
import { default as divider } from './divider.tsx?raw';

export default function(): Info {
    return {
        kind: 'layout', title: '_d.demo.divider', icon: IconDivider, path: 'divider',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Divider, source: divider, title: 'basic' },
        ]
    };
}
