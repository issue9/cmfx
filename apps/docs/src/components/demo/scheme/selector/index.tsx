// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTheme from '~icons/mdi/theme';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.schemeSelector',
		icon: IconTheme,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
