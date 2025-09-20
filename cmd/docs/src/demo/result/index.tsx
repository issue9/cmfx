// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './horizontal';
import { default as s1 } from './horizontal.tsx?raw';

import { default as C2 } from './vertical';
import { default as s2 } from './vertical.tsx?raw';

import { default as C3 } from './auto';
import { default as s3 } from './auto.tsx?raw';

import { default as C4 } from './empty';
import { default as s4 } from './empty.tsx?raw';

import { default as C5 } from './custom-empty';
import { default as s5 } from './custom-empty.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, title: 'horizontal' },
        { component: <C2 />, source: s2, title: 'vertical' },
        { component: <C3 />, source: s3, title: 'auto' },
        { component: <C4 />, source: s4, height: 250, title: 'empty' },
        { component: <C5 />, source: s5, height: 300, title: 'custom-empty' },
    ]}>
        用于是展示一操作的结果页
    </Stages>;
}
