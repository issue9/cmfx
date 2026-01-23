// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTime from '~icons/bxs/time';

import type { Info } from '@docs/components/base';

import { default as Time } from './time';
import { default as time } from './time.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-input', title: '_d.demo.time', icon: IconTime, path: 'form/time',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Time, source: time, title: 'time' },
        ]
    };
}
