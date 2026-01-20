// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconLabel from '~icons/material-symbols/label-rounded';

import type { Info } from '@docs/components/base';

import { default as Label } from './label';
import { default as label } from './label.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'general', title: '_d.demo.label', icon: IconLabel, path: 'label',
        api: api as Array<Type>, stages: [
            { component: Label, source: label, title: 'label' },
        ]
    };
}
