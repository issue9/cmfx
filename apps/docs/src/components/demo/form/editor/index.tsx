// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconEditor from '~icons/material-symbols/wysiwyg';

import type { Info } from '@docs/components/base';
import { default as Bubble } from './bubble';
import { default as bubble } from './bubble.tsx?raw';
import { default as Snow } from './snow';
import { default as snow } from './snow.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.editor',
		icon: IconEditor,
		path: 'form/editor',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: Snow, source: snow, title: '默认的编辑器' },
			{ component: Bubble, source: bubble, title: '简单的编辑器' },
		],
	};
}
