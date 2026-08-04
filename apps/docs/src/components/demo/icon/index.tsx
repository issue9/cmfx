// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconIcon from '~icons/tdesign/icon-filled';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.icon',
		icon: IconIcon,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
