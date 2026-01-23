// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDate from '~icons/lets-icons/date-range-light';

import type { Info } from '@docs/components/base';

import { default as Date } from './date';
import { default as date } from './date.tsx?raw';

import { default as Range } from './range';
import { default as range } from './range.tsx?raw';

import { default as Week } from './week';
import { default as week } from './week.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-input', title: '_d.demo.date', icon: IconDate, path: 'form/date',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Date, source: date, title: 'date' },
            { component: Range, source: range, title: 'range' },
            { component: Week, source: week, title: 'week' },
        ]
    };
}
