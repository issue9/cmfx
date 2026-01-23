// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTimer from '~icons/fluent/timer-10-24-filled';

import type { Info } from '@docs/components/base';

import { default as Timer } from './timer';
import { default as timer } from './timer.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.timer', icon: IconTimer, path: 'datetime/timer',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Timer, source: timer, title: 'timer' },
        ]
    };
}
