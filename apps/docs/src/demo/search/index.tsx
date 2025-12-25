// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Search } from './search';
import { default as search } from './search.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/search' api={api} stages={[
        { component: Search, source: search, title: '基本功能' },
    ]}>
    </Stages>;
}
