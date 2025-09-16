// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './h';
import { default as s1 } from './h.tsx?raw';

import { default as C2 } from './v';
import { default as s2 } from './v.tsx?raw';

import { default as C3 } from './panel';
import { default as s3 } from './panel.tsx?raw';

import { default as C4 } from './scroll-v';
import { default as s4 } from './scroll-v.tsx?raw';

import { default as C5 } from './scroll-h';
import { default as s5 } from './scroll-h.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, layout: 'horizontal', title: '横向' },
        { component: <C2 />, source: s2, layout: 'horizontal', title: '纵向' },
        { component: <C3 />, source: s3, layout: 'horizontal', title: '带面板' },
        { component: <C4 />, source: s4, layout: 'horizontal', title: '纵向滚动' },
        { component: <C5 />, source: s5, layout: 'horizontal', title: '横向滚动' },
    ]}>
    </Stages>;
}
