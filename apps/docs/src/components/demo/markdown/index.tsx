// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import IconMarkdown from '~icons/material-symbols/markdown';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.markdown',
		icon: IconMarkdown,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
