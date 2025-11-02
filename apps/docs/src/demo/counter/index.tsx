// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './basic';
import { default as s1 } from './basic.tsx?raw';

import { default as C2 } from './formatter';
import { default as s2 } from './formatter.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/counter' api={api} stages={[
        { component: C1, source: s1, title: 'basic' },
        { component: C2, source: s2, title: 'formatter' },
    ]}>
    </Stages>;
}
