// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconForm from '~icons/icon-park-outline/form';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.form',
		icon: IconForm,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
