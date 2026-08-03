// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconPage from '~icons/icon-park-outline/page';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'layout',
		title: '_d.demo.page',
		icon: IconPage,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
