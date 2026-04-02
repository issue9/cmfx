// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconIcon from '~icons/tdesign/icon-filled';

import type { Info } from '@docs/components/base';
import { default as IconSet } from './iconset';
import { default as iconSet } from './iconset.tsx?raw';
import { default as Text } from './text';
import { default as text } from './text.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.icon',
		icon: IconIcon,
		path: 'icon',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Text, source: text, id: 'text' },
			{ component: IconSet, source: iconSet, id: 'iconset' },
		],
	};
}
