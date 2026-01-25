// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconBacktop from '~icons/tabler/transition-top-filled';

import type { Info } from '@docs/components/base';

import { default as Custom } from './custom';
import { default as custom } from './custom.tsx?raw';

import { default as Preset } from './preset';
import { default as preset } from './preset.tsx?raw';

export default function(): Info {
    return {
        kind: 'navigation', title: '_d.demo.backtop', icon: IconBacktop, path: 'backtop',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Preset, source: preset, title: '_d.demo.basicFunctions' },
            { component: Custom, source: custom, title: '自定义图标' },
        ]
    };
}
