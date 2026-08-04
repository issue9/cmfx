// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconBacktop from '~icons/tabler/transition-top-filled';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.backtop',
		icon: IconBacktop,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
