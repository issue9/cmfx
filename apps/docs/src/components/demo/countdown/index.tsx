// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCountdown from '~icons/fluent/timer-10-24-filled';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.countdown',
		icon: IconCountdown,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
