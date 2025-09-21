// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './label';
import { default as s1 } from './label.tsx?raw';

import { default as C2 } from './description';
import { default as s2 } from './description.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, title: 'label' },
        { component: <C2 />, source: s2, title: 'description' },
    ]}>
    </Stages>;
}
