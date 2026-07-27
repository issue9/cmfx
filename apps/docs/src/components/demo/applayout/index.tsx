// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import IconLayout from '~icons/material-symbols/mobile-layout';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

export default function (): Info {
	return {
		kind: 'layout',
		title: '_d.demo.applayout',
		icon: IconLayout,
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [{ component: Basic, source: basic, id: 'basic' }],
	};
}
