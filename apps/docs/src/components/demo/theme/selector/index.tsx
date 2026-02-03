// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTheme from '~icons/mdi/theme';

import type { Info } from '@docs/components/base';
import { default as Selector } from './selector';
import { default as selector } from './selector.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.themeSelector',
		icon: IconTheme,
		path: 'theme/selector',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Selector, source: selector, title: 'basic' }],
	};
}
