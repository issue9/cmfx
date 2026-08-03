// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTransition from '~icons/material-symbols/masked-transitions';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.transition',
		icon: IconTransition,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
