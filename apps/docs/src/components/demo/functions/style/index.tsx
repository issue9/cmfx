// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconStyle from '~icons/material-symbols/style-outline';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'function',
		title: '_d.demo.style',
		icon: IconStyle,
		path: 'functions/style',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
	};
}
