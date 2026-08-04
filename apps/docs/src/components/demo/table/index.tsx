// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTable from '~icons/lets-icons/table';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.table',
		icon: IconTable,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
