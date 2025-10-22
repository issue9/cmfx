// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as C1 } from './date';
import { default as s1 } from './date.tsx?raw';

import { default as C2 } from './range';
import { default as s2 } from './range.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, title: 'date' },
        { component: <C2 />, source: s2, title: 'range' },
    ]}>
    </Stages>;
}
