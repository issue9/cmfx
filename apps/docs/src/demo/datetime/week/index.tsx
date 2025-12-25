// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Week } from './week';
import { default as week } from './week.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/week' api={api} stages={[
        { component: Week, source: week, title: 'week' },
    ]}>
    </Stages>;
}
