// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconLock from '~icons/material-symbols/lock';

import type { Info } from '@docs/components/base';
import { default as LockScreen } from './lockscreen';
import { default as lockScreen } from './lockscreen.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.lockScreen',
		icon: IconLock,
		path: 'lockscreen',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [{ component: LockScreen, source: lockScreen, id: 'lockscreen' }],
	};
}
