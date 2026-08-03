// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconChoice from '~icons/tdesign/component-dropdown-filled';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.choice',
		icon: IconChoice,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
