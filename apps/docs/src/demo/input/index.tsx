// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Input } from './input';
import { default as input } from './input.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/icon' api={api} stages={[
        { component: Input, source: input, title: 'input' },
    ]}>
    </Stages>;
}
