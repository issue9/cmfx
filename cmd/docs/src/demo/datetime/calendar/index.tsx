// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as C1 } from './calendar';
import { default as s1 } from './calendar.tsx?raw';

import { default as C2 } from './lunar';
import { default as s2 } from './lunar.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/calendar' api={api} stages={[
        { component: <C1 />, source: s1, layout: 'vertical', title: '基本功能' },
        { component: <C2 />, source: s2, layout: 'vertical', title: '农历' },
    ]}>
    </Stages>;
}
