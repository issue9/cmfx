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
		stages: [
			{
				component: Locale,
				source: locale,
				title: 'LocaleProvider',
				desc: '可通过 `LocaleProvider` 的属性修改所包含内容的语言。',
			},
			{ component: Global, source: global, title: 'setLocale', desc: '可通过 `setLocale` 修改全局的本地化内容。' },
			{ component: Other, source: other, title: '其它属性' },
			{ component: Nested, source: nested, title: '嵌套使用' },
		],
	};
}
