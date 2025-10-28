// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as C1 } from './snow';
import { default as s1 } from './snow.tsx?raw';

import { default as C2 } from './bubble';
import { default as s2 } from './bubble.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/editor' api={api} stages={[
        { component: <C1 />, source: s1, title: '默认的编辑器' },
        { component: <C2 />, source: s2, title: '简单的编辑器' },
    ]}>
    </Stages>;
}
