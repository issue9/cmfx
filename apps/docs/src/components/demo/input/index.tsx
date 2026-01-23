// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconInput from '~icons/material-symbols/input-rounded';

import type { Info } from '@docs/components/base';

import { default as Input } from './input';
import { default as input } from './input.tsx?raw';

export default function(): Info {
    return {
        kind: 'general', title: '_d.demo.input', icon: IconInput, path: 'input',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Input, source: input, title: 'input' },
        ]
    };
}
