// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Time } from './time';
import { default as time } from './time.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/time' api={api} stages={[
        { component: Time, source: time, title: 'time' },
    ]}>
    </Stages>;
}
