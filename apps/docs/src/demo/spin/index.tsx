// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Spin } from './spin';
import { default as spin } from './spin.tsx?raw';

import { default as Indicator } from './indicator';
import { default as indicator } from './indicator.tsx?raw';

import { default as Overlay } from './overlay';
import { default as overlay } from './overlay.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/spin' api={api} stages={[
        { component: Spin, source: spin, title: '基本功能' },
        { component: Indicator, source: indicator, title: 'indicator' },
        { component: Overlay, source: overlay, title: 'overlay' },
    ]}>
    </Stages>;
}
