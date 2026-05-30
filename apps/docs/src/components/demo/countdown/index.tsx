// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCountdown from '~icons/fluent/timer-10-24-filled';

import type { Info } from '@docs/components/base';
import { default as Countdown } from './countdown';
import { default as countdown } from './countdown.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.countdown',
		icon: IconCountdown,
		path: 'countdown',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [{ component: Countdown, source: countdown, id: 'countdown' }],
	};
}
