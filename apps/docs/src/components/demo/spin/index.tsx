// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconSpin from '~icons/pepicons-pop/arrow-spin-circle';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.spin',
		icon: IconSpin,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
