// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconEditor from '~icons/material-symbols/wysiwyg';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.editor',
		icon: IconEditor,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
