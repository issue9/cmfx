// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import IconMarkdown from '~icons/material-symbols/markdown';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.markdown',
		icon: IconMarkdown,
		path: 'markdown',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Basic, source: basic, title: 'basic' }],
	};
}
