// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTour from '~icons/entypo/popup';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.tour',
		icon: IconTour,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
