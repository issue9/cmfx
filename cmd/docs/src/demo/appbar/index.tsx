// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './appbar';
import { default as s1 } from './appbar.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/appbar' api={api} stages={[
        { component: C1, source: s1, title: '基本功能' },
    ]}>
    </Stages>;
}
