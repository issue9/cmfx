// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconLock from '~icons/material-symbols/lock';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.lockScreen',
		icon: IconLock,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
