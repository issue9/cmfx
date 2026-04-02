// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconPage from '~icons/icon-park-outline/page';

import type { Info } from '@docs/components/base';
import { default as Page } from './page';
import { default as page } from './page.tsx?raw';

export default function (): Info {
	return {
		kind: 'layout',
		title: '_d.demo.page',
		icon: IconPage,
		path: 'page',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [{ component: Page, source: page, id: 'page' }],
	};
}
