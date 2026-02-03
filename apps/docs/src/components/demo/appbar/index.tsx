// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconAppbar from '~icons/material-symbols/toolbar';

import type { Info } from '@docs/components/base';
import { default as Anchor } from './anchor';
import { default as anchor } from './anchor.tsx?raw';
import { default as Appbar } from './appbar';
import { default as appbar } from './appbar.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.appbar',
		icon: IconAppbar,
		path: 'appbar',
		footer: import.meta.glob('./FOOTER.*.md', { eager: true, query: '?raw', import: 'default' }),
		header: import.meta.glob('./HEADER.*.md', { eager: true, query: '?raw', import: 'default' }),
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: Appbar, source: appbar, title: '_d.demo.basicFunctions' },
			{ component: Anchor, source: anchor, title: '带链接' },
		],
	};
}
