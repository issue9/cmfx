// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './pagination';
import { default as s1 } from './pagination.tsx?raw';

import { default as C2 } from './bar';
import { default as s2 } from './bar.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, title: 'pagination' },
        { component: <C2 />, source: s2, title: 'pagination bar' },
    ]}>
    </Stages>;
}
