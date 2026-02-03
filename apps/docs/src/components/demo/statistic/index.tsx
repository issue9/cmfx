// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconStatistic from '~icons/octicon/number-16';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.statistic',
		icon: IconStatistic,
		path: 'statistic',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Basic, source: basic, title: 'basic' }],
	};
}
