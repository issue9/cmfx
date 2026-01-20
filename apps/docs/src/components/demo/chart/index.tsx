// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconChart from '~icons/tdesign/chart-pie-filled';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Chart } from './chart';
import { default as chart } from './chart.tsx?raw';

import { default as Pie } from './pie';
import { default as pie } from './pie.tsx?raw';

import { default as Axis } from './axis';
import { default as axis } from './axis.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'data-display', title: '_d.demo.chart', icon: IconChart, path: 'chart',
        component: () => <Stages dir='chart' api={api as Array<Type>} stages={[
            { component: Chart, source: chart, title: 'chart' },
            { component: Pie, source: pie, title: 'pie' },
            { component: Axis, source: axis, title: 'axis' },
        ]}>
        </Stages>,
    };
}
