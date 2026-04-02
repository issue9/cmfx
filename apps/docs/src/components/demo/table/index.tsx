// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTable from '~icons/lets-icons/table';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';
import { default as Loader } from './loader';
import { default as loader } from './loader.tsx?raw';
import { default as Paging } from './paging';
import { default as paging } from './paging.tsx?raw';
import { default as Table } from './table';
import { default as table } from './table.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.table',
		icon: IconTable,
		path: 'table',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Basic, source: basic, layout: 'vertical', id: 'basic' },
			{ component: Table, source: table, layout: 'vertical', id: 'table' },
			{ component: Loader, source: loader, layout: 'vertical', id: 'loader' },
			{ component: Paging, source: paging, layout: 'vertical', id: 'paging' },
		],
	};
}
