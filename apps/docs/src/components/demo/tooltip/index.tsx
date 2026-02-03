// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTooltip from '~icons/mdi/tooltip-text';

import type { Info } from '@docs/components/base';
import { default as Tooltip } from './tooltip';
import { default as tooltip } from './tooltip.tsx?raw';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.tooltip',
		icon: IconTooltip,
		path: 'tooltip',
		header: import.meta.glob('./HEADER.*.md', { eager: true, query: '?raw', import: 'default' }),
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Tooltip, source: tooltip, title: 'tooltip' }],
	};
}
