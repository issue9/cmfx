// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Transition } from './transition';
import { default as transition } from './transition.tsx?raw';

export default function(): JSX.Element {
    return <Stages dir='demo/transition' stages={[
        { component: Transition, source: transition, title: 'transition' },
    ]}>
    </Stages>;
}
