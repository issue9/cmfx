// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconAvatar from '~icons/material-symbols/person';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.avatar',
		icon: IconAvatar,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
