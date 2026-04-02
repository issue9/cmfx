// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import IconMarkdown from '~icons/material-symbols/markdown';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';
import { default as Block } from './block';
import { default as block } from './block.tsx?raw';
import { default as Inline } from './inline';
import { default as inline } from './inline.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.markdown',
		icon: IconMarkdown,
		path: 'markdown',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Basic, source: basic, id: 'basic' },
			{ component: Inline, source: inline, id: 'inline' },
			{ component: Block, source: block, id: 'block' },
		],
	};
}
