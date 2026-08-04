// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconInput from '~icons/material-symbols/input-rounded';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.input',
		icon: IconInput,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
