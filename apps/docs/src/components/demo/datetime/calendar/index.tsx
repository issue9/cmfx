// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCalendar from '~icons/solar/calendar-bold';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.calendar',
		icon: IconCalendar,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
