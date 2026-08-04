// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconLabel from '~icons/material-symbols/label-rounded';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.label',
		icon: IconLabel,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
