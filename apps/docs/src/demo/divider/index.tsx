// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Divider } from './divider';
import { default as divider } from './divider.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/divider' api={api} stages={[
        { component: Divider, source: divider, title: 'basic' },
    ]}>
    </Stages>;
}
