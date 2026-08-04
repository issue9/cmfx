// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconButton from '~icons/tdesign/button-filled';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.button',
		icon: IconButton,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
