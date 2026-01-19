// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconTimer from '~icons/fluent/timer-10-24-filled';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Timer } from './timer';
import { default as timer } from './timer.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.timer', icon: <IconTimer /> },
        kind: 'data-display', path: 'datetime/timer', component: () =>
            <Stages dir='datetime/timer' api={api as Array<Type>} stages={[
                { component: Timer, source: timer, title: 'timer' },
            ]}>
            </Stages>,
    };
}
