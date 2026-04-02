// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCode from '~icons/mingcute/code-fill';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';
import { default as Oninput } from './oninput';
import { default as oninput } from './oninput.tsx?raw';
import { default as Scrollable } from './scrollable';
import { default as scrollable } from './scrollable.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.code',
		icon: IconCode,
		path: 'code',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Basic, source: basic, id: 'basic' },
			{ component: Scrollable, source: scrollable, id: 'scrollable' },
			{ component: Oninput, source: oninput, id: 'oninput' },
		],
	};
}
