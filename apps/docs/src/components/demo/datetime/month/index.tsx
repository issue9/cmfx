// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconMonthPanel from '~icons/tabler/calendar-month';

import type { Info } from '@docs/components/base';

import { default as Month } from './month';
import { default as month } from './month.tsx?raw';

import { default as Year } from './year';
import { default as year } from './year.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.monthpanel', icon: IconMonthPanel, path: 'datetime/month',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Month, source: month, title: 'month' },
            { component: Year, source: year, title: 'year' },
        ]
    };
}
