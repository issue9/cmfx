// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconBadge from '~icons/f7/app-badge-fill';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.badge',
		icon: IconBadge,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
