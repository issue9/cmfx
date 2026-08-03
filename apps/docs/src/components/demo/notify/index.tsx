// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconNotify from '~icons/mdi/bell-notification-outline';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.notify',
		icon: IconNotify,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
