// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './transition';
import { default as s1 } from './transition.tsx?raw';

export default function(): JSX.Element {
    return <Stages dir='demo/transition' stages={[
        { component: C1, source: s1, title: 'transition' },
    ]}>
    </Stages>;
}
