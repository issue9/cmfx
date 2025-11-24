// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as WCAG } from './wcag';
import { default as wcag } from './wcag.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/code' api={api} stages={[
        { component: Basic, source: basic, layout: 'auto', title: '基本功能' },
        { component: WCAG, source: wcag, layout: 'auto', title: 'WCAG' },
    ]}>
    </Stages>;
}
