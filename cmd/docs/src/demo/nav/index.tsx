// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './nav';
import { default as s1 } from './nav.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/nav' api={api} stages={[
        { component: <C1 />, source: s1, layout: 'vertical', title: 'nav' },
    ]} />;
}
