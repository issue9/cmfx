// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconIllustration from '~icons/uil/illustration';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.illustrations',
		icon: IconIllustration,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
