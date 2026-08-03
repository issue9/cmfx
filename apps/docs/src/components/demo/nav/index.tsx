// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconNav from '~icons/material-symbols/list-alt-rounded';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.nav',
		icon: IconNav,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
