// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconEditor from '~icons/material-symbols/wysiwyg';

import type { Info } from '@docs/components/base';
import { default as Editor } from './editor';
import { default as editor } from './editor.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.editor',
		icon: IconEditor,
		path: 'editor',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [{ component: Editor, source: editor, id: 'editor' }],
	};
}
