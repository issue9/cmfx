// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDescription from '~icons/material-symbols/description';

import type { Info } from '@docs/components/base';
import { default as Desc } from './description';
import { default as desc } from './description.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.description',
		icon: IconDescription,
		path: 'description',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Desc, source: desc, title: 'description' }],
	};
}
