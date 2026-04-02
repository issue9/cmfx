// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconThemeConfig from '~icons/mdi/theme-light-dark';

import type { Info } from '@docs/components/base';
import { default as Global } from './global';
import { default as global } from './global.tsx?raw';
import { default as Nested } from './nested';
import { default as nested } from './nested.tsx?raw';
import { default as Theme } from './theme';
import { default as theme } from './theme.tsx?raw';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.themeConfig',
		icon: IconThemeConfig,
		path: 'config/theme',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Theme, source: theme, id: 'theme' },
			{ component: Global, source: global, id: 'global' },
			{ component: Nested, source: nested, id: 'nested' },
		],
	};
}
