// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCode from '~icons/mingcute/code-fill';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.code',
		icon: IconCode,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
