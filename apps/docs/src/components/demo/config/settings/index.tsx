// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconSettings from '~icons/material-symbols/settings';

import type { Info } from '@docs/components/base';
import { default as Settings } from './settings';
import { default as settings } from './settings.tsx?raw';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.settings',
		icon: IconSettings,
		path: 'config/settings',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [{ component: Settings, source: settings, layout: 'vertical', id: 'settings' }],
	};
}
