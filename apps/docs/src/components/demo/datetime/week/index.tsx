// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconWeekPanel from '~icons/fa7-solid/calendar-week';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Week } from './week';
import { default as week } from './week.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.weekPanel', icon: IconWeekPanel, path: 'datetime/week',
        component: () => <Stages dir='datetime/week' api={api as Array<Type>} stages={[
            { component: Week, source: week, title: 'week' },
        ]}>
        </Stages>,
    };
}
