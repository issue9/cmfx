// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Notify } from './notify';
import { default as notify } from './notify.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/notify' api={api} stages={[
        { component: Notify, source: notify, title: 'notify' },
    ]}>
    </Stages>;
}
