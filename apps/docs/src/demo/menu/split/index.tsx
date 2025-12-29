// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Split } from './split';
import { default as split } from './split.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/menu' api={api} stages={[
        { component: Split, source: split, title: 'SplitMenu' },
    ]}>
    </Stages>;
}
