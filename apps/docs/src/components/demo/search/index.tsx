// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconSearch from '~icons/material-symbols/search-rounded';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Search } from './search';
import { default as search } from './search.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.search', icon: <IconSearch /> },
        kind: 'feedback', path: 'search', component: () =>
            <Stages dir='search' api={api as Array<Type>} stages={[
                { component: Search, source: search, title: '基本功能' },
            ]}>
            </Stages>,
    };
}
