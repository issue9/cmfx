// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './number';
import { default as s1 } from './number.tsx?raw';

import { default as C2 } from './multiple';
import { default as s2 } from './multiple.tsx?raw';

import { default as C3 } from './anchor';
import { default as s3 } from './anchor.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/menu' api={api} stages={[
        { component: C1, source: s1, height: 800, title: '数字作为值' },
        { component: C2, source: s2, title: '多选' },
        { component: C3, source: s3, title: '链接' },
    ]}>
    </Stages>;
}
