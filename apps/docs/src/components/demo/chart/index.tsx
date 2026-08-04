// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconChart from '~icons/tdesign/chart-pie-filled';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.chart',
		icon: IconChart,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
