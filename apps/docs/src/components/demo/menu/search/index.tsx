// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconSearch from '~icons/material-symbols/search-rounded';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.search',
		icon: IconSearch,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
