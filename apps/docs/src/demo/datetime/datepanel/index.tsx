// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Date } from './date';
import { default as date } from './date.tsx?raw';

import { default as Range } from './range';
import { default as range } from './range.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/datepanel' api={api as Array<Type>} stages={[
        { component: Date, source: date, title: 'date' },
        { component: Range, source: range, title: 'range' },
    ]}>
    </Stages>;
}
