// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTimePanel from '~icons/mingcute/calendar-time-add-fill';

import type { Info } from '@docs/components/base';

import { default as Timepanel } from './timepanel';
import { default as timepanel } from './timepanel.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.timepanel', icon: IconTimePanel, path: 'datetime/timepanel',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Timepanel, source: timepanel, title: 'timepanel' },
        ]
    };
}
