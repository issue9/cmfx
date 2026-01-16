// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as WCAG } from './wcag';
import { default as wcag } from './wcag.tsx?raw';

import { default as Disabled } from './disabled';
import { default as disabled } from './disabled.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/code' api={api as Array<Type>} stages={[
        { component: Basic, source: basic, layout: 'auto', title: '基本功能' },
        { component: WCAG, source: wcag, layout: 'auto', title: 'WCAG' },
        { component: Disabled, source: disabled, layout: 'auto', title: 'disabled' },
    ]}>
    </Stages>;
}
