// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconMonthPanel from '~icons/tabler/calendar-month';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Month } from './month';
import { default as month } from './month.tsx?raw';

import { default as Year } from './year';
import { default as year } from './year.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.monthpanel', icon: <IconMonthPanel /> },
        kind: 'data-display', path: '/monthpanel', component: () =>
            <Stages dir='datetime/month' api={api as Array<Type>} stages={[
                { component: Month, source: month, title: 'month' },
                { component: Year, source: year, title: 'year' },
            ]}>
            </Stages>,
    };
}
