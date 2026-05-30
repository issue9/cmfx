// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTimePanel from '~icons/mingcute/calendar-time-add-fill';

import type { Info } from '@docs/components/base';
import { default as Panel } from './panel';
import { default as panel } from './panel.tsx?raw';
import { default as Popover } from './popover';
import { default as popover } from './popover.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.time',
		icon: IconTimePanel,
		path: 'datetime/time',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Panel, source: panel, id: 'time' },
			{ component: Popover, source: popover, id: 'popover' },
		],
	};
}
