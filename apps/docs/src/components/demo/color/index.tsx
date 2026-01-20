// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconColorPanel from '~icons/material-symbols/format-color-fill-rounded';

import type { Info } from '@docs/components/base';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as WCAG } from './wcag';
import { default as wcag } from './wcag.tsx?raw';

import { default as Disabled } from './disabled';
import { default as disabled } from './disabled.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.color', icon: IconColorPanel, path: 'color',
        api: api as Array<Type>, stages: [
            { component: Basic, source: basic, layout: 'auto', title: '基本功能' },
            { component: WCAG, source: wcag, layout: 'auto', title: 'WCAG' },
            { component: Disabled, source: disabled, layout: 'auto', title: 'disabled' },
        ],
    };
}
