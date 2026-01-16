// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Appbar } from './appbar';
import { default as appbar } from './appbar.tsx?raw';

import { default as Anchor } from './anchor';
import { default as anchor } from './anchor.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/appbar' api={api as Array<Type>} stages={[
        { component: Appbar, source: appbar, title: '基本功能' },
        { component: Anchor, source: anchor, title: '带链接' },
    ]}>
    </Stages>;
}
