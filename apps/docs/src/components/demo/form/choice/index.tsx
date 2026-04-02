// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconChoice from '~icons/tdesign/component-dropdown-filled';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';
import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.choice',
		icon: IconChoice,
		path: 'form/choice',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Basic, source: basic, id: 'basic' },
			{ component: Multiple, source: multiple, id: 'multiple' },
		],
	};
}
