// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDatePanel from '~icons/solar/calendar-date-bold';

import type { Info } from '@docs/components/base';

import { default as Date } from './date';
import { default as date } from './date.tsx?raw';

import { default as Range } from './range';
import { default as range } from './range.tsx?raw';


export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.datepanel', icon: IconDatePanel, path: '/datetime/datepanel',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Date, source: date, title: 'date' },
            { component: Range, source: range, title: 'range' },
        ]
    };
}
