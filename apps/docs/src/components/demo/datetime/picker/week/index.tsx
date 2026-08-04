// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconWeekPicker from '~icons/fa7-solid/calendar-week';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.weekPicker',
		icon: IconWeekPicker,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
