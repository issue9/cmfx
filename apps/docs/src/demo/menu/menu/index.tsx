// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Number } from './number';
import { default as number } from './number.tsx?raw';

import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

import { default as Anchor } from './anchor';
import { default as anchor } from './anchor.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/menu' api={api} stages={[
        { component: Number, source: number, height: '800px', title: '数字作为值' },
        { component: Multiple, source: multiple, title: '多选' },
        { component: Anchor, source: anchor, title: '链接' },
    ]}>
    </Stages>;
}
