// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as C1 } from './illustrations';
import { default as s1 } from './illustrations.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/illustations' stages={[
        { component: <C1 />, source: s1, title: '插图' },
    ]}>
    </Stages>;
}
