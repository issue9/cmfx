// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Pagination } from './pagination';
import { default as pagination } from './pagination.tsx?raw';

import { default as Bar } from './bar';
import { default as bar } from './bar.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/pagination' api={api as Array<Type>} stages={[
        { component: Pagination, source: pagination, title: 'pagination' },
        { component: Bar, source: bar, title: 'pagination bar' },
    ]}>
    </Stages>;
}
