// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as H } from './horizontal';
import { default as h } from './horizontal.tsx?raw';

import { default as V } from './vertical';
import { default as v } from './vertical.tsx?raw';

import { default as Auto } from './auto';
import { default as auto } from './auto.tsx?raw';

import { default as Empty } from './empty';
import { default as empty } from './empty.tsx?raw';

import { default as Custom } from './custom-empty';
import { default as custom } from './custom-empty.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/result' api={api} stages={[
        { component: H, source: h, title: 'horizontal' },
        { component: V, source: v, title: 'vertical' },
        { component: Auto, source: auto, title: 'auto' },
        { component: Empty, source: empty, height: '250px', title: 'empty' },
        { component: Custom, source: custom, height: '300px', title: 'custom-empty' },
    ]}>
        用于是展示一操作的结果页
    </Stages>;
}
