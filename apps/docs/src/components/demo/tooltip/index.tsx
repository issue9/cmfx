// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconTooltip from '~icons/mdi/tooltip-text';

import type { Info } from '@docs/components/base';

import { default as Tooltip } from './tooltip';
import { default as tooltip } from './tooltip.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'feedback', title: '_d.demo.tooltip', icon: IconTooltip, path: 'tooltip',
        desc: '这是一个弹出提示组件',
        api: api as Array<Type>, stages: [
            { component: Tooltip, source: tooltip, title: 'tooltip' },
        ]
    };
}
