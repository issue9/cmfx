// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconNav from '~icons/material-symbols/list-alt-rounded';

import type { Info } from '@docs/components/base';
import { default as Nav } from './nav';
import { default as nav } from './nav.tsx?raw';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.nav',
		icon: IconNav,
		path: 'nav',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Nav, source: nav, layout: 'vertical', title: 'nav' }],
	};
}
