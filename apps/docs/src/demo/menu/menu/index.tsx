// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Layout } from './layout';
import { default as layout } from './layout.tsx?raw';

import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

import { default as Anchor } from './anchor';
import { default as anchor } from './anchor.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/menu' api={api as Array<Type>} stages={[
        { component: Layout, source: layout, title: '布局' },
        { component: Multiple, source: multiple, title: '多选' },
        { component: Anchor, source: anchor, title: '链接' },
    ]}>
    </Stages>;
}
