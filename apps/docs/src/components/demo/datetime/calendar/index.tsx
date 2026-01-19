// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconCalendar from '~icons/solar/calendar-bold';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Calendar } from './calendar';
import { default as calendar } from './calendar.tsx?raw';

import { default as Lunar } from './lunar';
import { default as lunar } from './lunar.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.calendar', icon: <IconCalendar /> },
        kind: 'data-display', path: 'datetime/calendar', component: () =>
            <Stages dir='datetime/calendar' api={api as Array<Type>} stages={[
                { component: Calendar, source: calendar, layout: 'vertical', title: '基本功能' },
                { component: Lunar, source: lunar, layout: 'vertical', title: '农历' },
            ]}>
            </Stages>,
    };
}
