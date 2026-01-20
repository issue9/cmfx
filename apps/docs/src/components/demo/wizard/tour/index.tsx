// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconTour from '~icons/entypo/popup';

import type { Info } from '@docs/components/base';

import { default as Tour } from './tour';
import { default as tour } from './tour.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'navigation', title: '_d.demo.tour', icon: IconTour, path: 'wizard/tour',
        api: api as Array<Type>, stages: [
            { component: Tour, source: tour, title: 'tour' },
        ]
    };
}
