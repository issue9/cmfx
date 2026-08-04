// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTooltip from '~icons/mdi/tooltip-text';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.tooltip',
		icon: IconTooltip,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
