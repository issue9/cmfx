// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDatePicker from '~icons/solar/calendar-date-bold';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.datepicker',
		icon: IconDatePicker,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
