// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Calendar } from './calendar';
import { default as calendar } from './calendar.tsx?raw';

import { default as Lunar } from './lunar';
import { default as lunar } from './lunar.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/calendar' api={api} stages={[
        { component: Calendar, source: calendar, layout: 'vertical', title: '基本功能' },
        { component: Lunar, source: lunar, layout: 'vertical', title: '农历' },
    ]}>
    </Stages>;
}
