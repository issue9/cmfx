// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './svg';
import { default as s1 } from './svg.tsx?raw';

import { default as C2 } from './pie';
import { default as s2 } from './pie.tsx?raw';

import { default as C3 } from './axis';
import { default as s3 } from './axis.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/chart' api={api} stages={[
        { component: <C1 />, source: s1, title: 'svg 图片' },
        { component: <C2 />, source: s2, title: 'pie' },
        { component: <C3 />, source: s3, title: 'axis' },
    ]}>
    </Stages>;
}
