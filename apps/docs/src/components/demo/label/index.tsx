// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconLabel from '~icons/material-symbols/label-rounded';

import type { Info } from '@docs/components/base';
import { default as Label } from './label';
import { default as label } from './label.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.label',
		icon: IconLabel,
		path: 'label',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Label, source: label, title: 'label' }],
	};
}
