// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCounter from '~icons/ix/counter';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.counter',
		icon: IconCounter,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
