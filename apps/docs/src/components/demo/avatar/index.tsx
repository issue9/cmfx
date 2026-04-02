// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconAvatar from '~icons/material-symbols/person';

import type { Info } from '@docs/components/base';
import { default as Avatar } from './avatar';
import { default as avatar } from './avatar.tsx?raw';
import { default as Fallback } from './fallback';
import { default as fallback } from './fallback.tsx?raw';
import { default as Hover } from './hover';
import { default as hover } from './hover.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.avatar',
		icon: IconAvatar,
		path: 'avatar',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Avatar, source: avatar, id: 'avatar' },
			{ component: Fallback, source: fallback, id: 'fallback' },
			{ component: Hover, source: hover, id: 'hover' },
		],
	};
}
