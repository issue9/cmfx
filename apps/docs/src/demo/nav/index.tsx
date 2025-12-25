// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Nav } from './nav';
import { default as nav } from './nav.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/nav' api={api} stages={[
        { component: Nav, source: nav, layout: 'vertical', title: 'nav' },
    ]} />;
}
