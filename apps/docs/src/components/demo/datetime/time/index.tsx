// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTimePanel from '~icons/mingcute/calendar-time-add-fill';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.time',
		icon: IconTimePanel,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
