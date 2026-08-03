// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCheckbox from '~icons/mdi/checkbox-multiple-marked';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.checkbox',
		icon: IconCheckbox,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
