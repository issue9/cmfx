// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconPagination from '~icons/stash/pagination-duotone';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.pagination',
		icon: IconPagination,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
