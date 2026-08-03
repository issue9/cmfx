// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconAppbar from '~icons/material-symbols/toolbar';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.appbar',
		icon: IconAppbar,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
