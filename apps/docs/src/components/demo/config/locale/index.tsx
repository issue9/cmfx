// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconLocaleConfig from '~icons/fluent-mdl2/locale-language';

import type { Info } from '@docs/components/base';
import { default as Global } from './global';
import { default as global } from './global.tsx?raw';
import { default as Locale } from './locale';
import { default as locale } from './locale.tsx?raw';
import { default as Nested } from './nested';
import { default as nested } from './nested.tsx?raw';
import { default as Other } from './other';
import { default as other } from './other.tsx?raw';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.localeConfig',
		icon: IconLocaleConfig,
		path: 'config/locale',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Locale, source: locale, id: 'locale' },
			{ component: Global, source: global, id: 'global' },
			{ component: Other, source: other, id: 'other' },
			{ component: Nested, source: nested, id: 'nested' },
		],
	};
}
