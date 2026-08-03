// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconMenu from '~icons/bi/menu-down';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.menu',
		icon: IconMenu,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
