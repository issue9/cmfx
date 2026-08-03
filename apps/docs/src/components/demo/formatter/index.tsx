// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import IconFormatter from '~icons/material-symbols/text-format-rounded';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'function',
		title: '_d.demo.formatter',
		icon: IconFormatter,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
