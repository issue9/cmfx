// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './preset';
import { default as s1 } from './preset.tsx?raw';

import { default as C2 } from './custom';
import { default as s2 } from './custom.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/backtop' api={api} stages={[
        { component: C1, source: s1, title: '基本功能' },
        { component: C2, source: s2, title: '自定义图标' },
    ]}>
    </Stages>;
}
