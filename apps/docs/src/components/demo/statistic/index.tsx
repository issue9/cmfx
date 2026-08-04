// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconStatistic from '~icons/octicon/number-16';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.statistic',
		icon: IconStatistic,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
