// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconInput from '~icons/material-symbols/input-rounded';

import type { Info } from '@docs/components/base';

import { default as api } from './api.json' with { type: 'json' };

import { default as Input } from './input';
import { default as input } from './input.tsx?raw';

export default function(): Info {
    return {
        kind: 'general', title: '_d.demo.input', icon: IconInput, path: 'input',
        api: api as Array<Type>, stages: [
            { component: Input, source: input, title: 'input' },
        ]
    };
}
