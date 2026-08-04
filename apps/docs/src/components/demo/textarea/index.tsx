// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTextarea from '~icons/bi/textarea-resize';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.textarea',
		icon: IconTextarea,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
