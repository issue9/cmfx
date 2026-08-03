// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconIcon from '~icons/akar-icons/clipboard';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'function',
		title: '_d.demo.clipboard',
		icon: IconIcon,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
