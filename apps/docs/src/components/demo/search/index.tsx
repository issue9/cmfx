// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconSearch from '~icons/material-symbols/search-rounded';

import type { Info } from '@docs/components/base';
import { default as Search } from './search';
import { default as search } from './search.tsx?raw';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.search',
		icon: IconSearch,
		path: 'search',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Search, source: search, title: '_d.demo.basicFunctions' }],
	};
}
