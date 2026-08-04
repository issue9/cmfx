// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDialog from '~icons/material-symbols/dialogs-outline-rounded';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.dialog',
		icon: IconDialog,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
