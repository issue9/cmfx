// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconNotify from '~icons/mdi/bell-notification-outline';

import type { Info } from '@docs/components/base';
import { default as Alert } from './alert';
import { default as alert } from './alert.tsx?raw';
import { default as Body } from './body';
import { default as body } from './body.tsx?raw';
import { default as Duration } from './duration';
import { default as duration } from './duration.tsx?raw';
import { default as Notify } from './notify';
import { default as notify } from './notify.tsx?raw';

export default function (): Info {
	return {
		kind: 'feedback',
		title: '_d.demo.notify',
		icon: IconNotify,
		path: 'notify',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Notify, source: notify, id: 'notify' },
			{ component: Alert, source: alert, id: 'alert' },
			{ component: Body, source: body, id: 'body' },
			{ component: Duration, source: duration, id: 'duration' },
		],
	};
}
