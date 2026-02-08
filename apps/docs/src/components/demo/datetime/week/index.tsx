// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconWeekPanel from '~icons/fa7-solid/calendar-week';

import type { Info } from '@docs/components/base';
import { default as Week } from './week';
import { default as week } from './week.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.weekPanel',
		icon: IconWeekPanel,
		path: 'datetime/week',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Week, source: week, title: 'week' }],
	};
}
