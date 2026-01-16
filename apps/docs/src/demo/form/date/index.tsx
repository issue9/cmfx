// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Date } from './date';
import { default as date } from './date.tsx?raw';

import { default as Range } from './range';
import { default as range } from './range.tsx?raw';

import { default as Week } from './week';
import { default as week } from './week.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/date' api={api as Array<Type>} stages={[
        { component: Date, source: date, title: 'date' },
        { component: Range, source: range, title: 'range' },
        { component: Week, source: week, title: 'week' },
    ]}>
    </Stages>;
}
