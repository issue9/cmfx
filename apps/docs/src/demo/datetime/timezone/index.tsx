// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Timezone } from './timezone';
import { default as timezone } from './timezone.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/timezone' api={api} stages={[
        { component: Timezone, source: timezone, layout: 'vertical', title: '基本功能' },
    ]}>
    </Stages>;
}
