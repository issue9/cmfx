// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconLocaleConfig from '~icons/fluent-mdl2/locale-language';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.localeConfig',
		icon: IconLocaleConfig,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
