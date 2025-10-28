// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './header';
import { default as s1 } from './header.tsx?raw';

import { default as C2 } from './footer';
import { default as s2 } from './footer.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/card' api={api} stages={[
        { component: <C1 />, source: s1, title: 'header' },
        { component: <C2 />, source: s2, title: 'footer' },
    ]}>
    </Stages>;
}
