// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDivider from '~icons/pixel/divider-solid';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'layout',
		title: '_d.demo.divider',
		icon: IconDivider,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
