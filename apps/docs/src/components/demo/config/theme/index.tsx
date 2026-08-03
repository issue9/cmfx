// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconThemeConfig from '~icons/mdi/theme-light-dark';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.themeConfig',
		icon: IconThemeConfig,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
