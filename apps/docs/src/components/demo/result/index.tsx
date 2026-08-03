// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconResult from '~icons/stash/search-results';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.result',
		icon: IconResult,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
