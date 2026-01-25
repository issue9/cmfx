// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconPagination from '~icons/stash/pagination-duotone';

import type { Info } from '@docs/components/base';

import { default as Pagination } from './pagination';
import { default as pagination } from './pagination.tsx?raw';

import { default as Bar } from './bar';
import { default as bar } from './bar.tsx?raw';

export default function(): Info {
    return {
        kind: 'navigation', title: '_d.demo.pagination', icon: IconPagination, path: 'pagination',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Pagination, source: pagination, title: 'pagination' },
            { component: Bar, source: bar, title: 'pagination bar' },
        ]
    };
}
