// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDateRangePicker from '~icons/material-symbols/date-range-rounded';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.dateRangePicker',
		icon: IconDateRangePicker,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
