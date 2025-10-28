// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as C1 } from './timepanel';
import { default as s1 } from './timepanel.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/timepanel' api={api} stages={[
        { component: <C1 />, source: s1, title: 'timepanel' },
    ]}>
    </Stages>;
}
