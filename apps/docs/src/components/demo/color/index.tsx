// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconColorPanel from '~icons/material-symbols/format-color-fill-rounded';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.color',
		icon: IconColorPanel,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
