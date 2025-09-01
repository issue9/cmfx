// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as C1 } from './text';
import { default as s1 } from './text.tsx?raw';

import { default as C2 } from './animation';
import { default as s2 } from './animation.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, title: '与文本的排版' },
        { component: <C2 />, source: s2, title: '动画图标' },
    ]}>
    </Stages>;
}
