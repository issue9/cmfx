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
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [{ component: Tooltip, source: tooltip, id: 'tooltip' }],
	};
}
