// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconRadio from '~icons/akar-icons/radio-fill';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.radio',
		icon: IconRadio,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
