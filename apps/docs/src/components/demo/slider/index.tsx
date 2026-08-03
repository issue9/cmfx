// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconRange from '~icons/uil/slider-h-range';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.slider',
		icon: IconRange,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
