// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTab from '~icons/material-symbols/tab-outline';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.tab',
		icon: IconTab,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
