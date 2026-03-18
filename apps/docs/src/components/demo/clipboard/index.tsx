// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconIcon from '~icons/akar-icons/clipboard';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

export default function (): Info {
	return {
		kind: 'function',
		title: '_d.demo.clipboard',
		icon: IconIcon,
		path: 'icon',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Basic, source: basic, title: '_d.demo.basicFunctions' }],
	};
}
