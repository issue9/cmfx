// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as C1 } from './input';
import { default as s1 } from './input.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/icon' api={api} stages={[
        { component: C1, source: s1, title: 'input' },
    ]}>
    </Stages>;
}
