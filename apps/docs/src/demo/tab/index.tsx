// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as H } from './h';
import { default as h } from './h.tsx?raw';

import { default as V } from './v';
import { default as v } from './v.tsx?raw';

import { default as Panel } from './panel';
import { default as panel } from './panel.tsx?raw';

import { default as ScrollV } from './scroll-v';
import { default as scrollV } from './scroll-v.tsx?raw';

import { default as ScrollH } from './scroll-h';
import { default as scrollH } from './scroll-h.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/tab' api={api} stages={[
        { component: H, source: h, layout: 'horizontal', title: '横向' },
        { component: V, source: v, layout: 'horizontal', title: '纵向' },
        { component: Panel, source: panel, layout: 'horizontal', title: '带面板' },
        { component: ScrollV, source: scrollV, layout: 'horizontal', title: '纵向滚动' },
        { component: ScrollH, source: scrollH, layout: 'horizontal', title: '横向滚动' },
    ]}>
    </Stages>;
}
