// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDescription from '~icons/material-symbols/description';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.description',
		icon: IconDescription,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
