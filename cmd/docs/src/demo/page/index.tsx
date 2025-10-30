// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as C1 } from './page';
import { default as s1 } from './page.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/page' api={api} stages={[
        { component: C1, source: s1, title: '基本用法' },
    ]}>
    </Stages>;
}
