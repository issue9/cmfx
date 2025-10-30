// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './tooltip';
import { default as s1 } from './tooltip.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/tooltip' api={api} stages={[
        { component: C1, source: s1, title: 'tooltip' },
    ]}>
        这是一个弹出提示组件
    </Stages>;
}
