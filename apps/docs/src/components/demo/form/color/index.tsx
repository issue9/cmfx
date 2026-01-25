// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconColor from '~icons/streamline/color-picker-remix';

import type { Info } from '@docs/components/base';

import { default as Picker } from './picker';
import { default as picker } from './picker.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-input', title: '_d.demo.color', icon: IconColor, path: 'form/color',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Picker, source: picker, title: 'picker' },
        ]
    };
}
