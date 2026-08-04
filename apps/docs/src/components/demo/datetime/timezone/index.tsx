// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTimezone from '~icons/mdi/timezone';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.timezone',
		icon: IconTimezone,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
