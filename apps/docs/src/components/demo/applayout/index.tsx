// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import IconLayout from '~icons/material-symbols/mobile-layout';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'layout',
		title: '_d.demo.applayout',
		icon: IconLayout,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
