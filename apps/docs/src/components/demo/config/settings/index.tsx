// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconSettings from '~icons/material-symbols/settings';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.settings',
		icon: IconSettings,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
