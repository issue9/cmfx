// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTab from '~icons/material-symbols/tab-outline';

import type { Info } from '@docs/components/base';
import { default as H } from './h';
import { default as h } from './h.tsx?raw';
import { default as Panel } from './panel';
import { default as panel } from './panel.tsx?raw';
import { default as ScrollH } from './scroll-h';
import { default as scrollH } from './scroll-h.tsx?raw';
import { default as ScrollV } from './scroll-v';
import { default as scrollV } from './scroll-v.tsx?raw';
import { default as V } from './v';
import { default as v } from './v.tsx?raw';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.tab',
		icon: IconTab,
		path: 'tab',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: H, source: h, layout: 'horizontal', title: '横向' },
			{ component: V, source: v, layout: 'horizontal', title: '纵向' },
			{ component: Panel, source: panel, layout: 'horizontal', title: '带面板' },
			{ component: ScrollV, source: scrollV, layout: 'horizontal', title: '纵向滚动' },
			{ component: ScrollH, source: scrollH, layout: 'horizontal', title: '横向滚动' },
		],
	};
}
