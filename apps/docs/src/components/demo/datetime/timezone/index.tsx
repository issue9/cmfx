// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTimezone from '~icons/mdi/timezone';

import type { Info } from '@docs/components/base';
import { default as Timezone } from './timezone';
import { default as timezone } from './timezone.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.timezone',
		icon: IconTimezone,
		path: 'datetime/timezone',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Timezone, source: timezone, layout: 'vertical', title: '_d.demo.basicFunctions' }],
	};
}
