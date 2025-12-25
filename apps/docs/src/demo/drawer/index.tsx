// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Float } from './float';
import { default as float } from './float.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/drawer' api={api} stages={[
        { component: Basic, source: basic, title: 'basic' },
        { component: Float, source: float, title: 'float' },
    ]}>
    </Stages>;
}
