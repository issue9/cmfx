// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Timer } from './timer';
import { default as timer } from './timer.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/timer' api={api as Array<Type>} stages={[
        { component: Timer, source: timer, title: 'timer' },
    ]}>
    </Stages>;
}
