// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './basic';
import { default as s1 } from './basic.tsx?raw';

import { default as C2 } from './text';
import { default as s2 } from './text.tsx?raw';

import { default as C3 } from './long';
import { default as s3 } from './long.tsx?raw';

import { default as C4 } from './icon';
import { default as s4 } from './icon.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/badge' api={api} stages={[
        { component: C1, source: s1, title: '基本功能' },
        { component: C2, source: s2, title: '文本' },
        { component: C3, source: s3, title: '长文本' },
        { component: C4, source: s4, title: '图标' },
    ]}>
    </Stages>;
}
