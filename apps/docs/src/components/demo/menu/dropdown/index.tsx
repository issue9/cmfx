// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDropdown from '~icons/material-symbols/dropdown-outline';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.dropdown',
		icon: IconDropdown,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
