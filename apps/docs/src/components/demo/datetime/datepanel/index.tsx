// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconDatePanel from '~icons/solar/calendar-date-bold';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Date } from './date';
import { default as date } from './date.tsx?raw';

import { default as Range } from './range';
import { default as range } from './range.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.datepanel', icon: IconDatePanel, path: '/datetime/datepanel',
        component: () => <Stages dir='datetime/datepanel' api={api as Array<Type>} stages={[
            { component: Date, source: date, title: 'date' },
            { component: Range, source: range, title: 'range' },
        ]}>
        </Stages>,
    };
}
