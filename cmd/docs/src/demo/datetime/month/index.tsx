// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as C1 } from './month';
import { default as s1 } from './month.tsx?raw';

import { default as C2 } from './year';
import { default as s2 } from './year.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/month' api={api} stages={[
        { component: <C1 />, source: s1, title: 'month' },
        { component: <C2 />, source: s2, title: 'year' },
    ]}>
    </Stages>;
}
