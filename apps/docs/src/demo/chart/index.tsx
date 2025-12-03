// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Chart } from './chart';
import { default as chart } from './chart.tsx?raw';

import { default as Pie } from './pie';
import { default as pie } from './pie.tsx?raw';

import { default as Axis } from './axis';
import { default as axis } from './axis.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/chart' api={api} stages={[
        { component: Chart, source: chart, title: 'svg 图片' },
        { component: Pie, source: pie, title: 'pie' },
        { component: Axis, source: axis, title: 'axis' },
    ]}>
    </Stages>;
}
