// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconOptionsConfig from '~icons/eva/options-2-fill';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.optionsConfig',
		icon: IconOptionsConfig,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
