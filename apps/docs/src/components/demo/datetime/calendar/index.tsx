// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCalendar from '~icons/solar/calendar-bold';

import type { Info } from '@docs/components/base';

import { default as Calendar } from './calendar';
import { default as calendar } from './calendar.tsx?raw';

import { default as Lunar } from './lunar';
import { default as lunar } from './lunar.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.calendar', icon: IconCalendar, path: 'datetime/calendar',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Calendar, source: calendar, layout: 'vertical', title: '基本功能' },
            { component: Lunar, source: lunar, layout: 'vertical', title: '农历' },
        ]
    };
}
