// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconBadge from '~icons/f7/app-badge-fill';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';
import { default as Icon } from './icon';
import { default as icon } from './icon.tsx?raw';
import { default as Long } from './long';
import { default as long } from './long.tsx?raw';
import { default as Text } from './text';
import { default as text } from './text.tsx?raw';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.badge',
		icon: IconBadge,
		path: 'badge',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Basic, source: basic, id: 'basic' },
			{ component: Text, source: text, id: 'text' },
			{ component: Long, source: long, id: 'long' },
			{ component: Icon, source: icon, id: 'icon' },
		],
	};
}
