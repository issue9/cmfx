// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDrawer from '~icons/ri/archive-drawer-fill';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'layout',
		title: '_d.demo.drawer',
		icon: IconDrawer,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
