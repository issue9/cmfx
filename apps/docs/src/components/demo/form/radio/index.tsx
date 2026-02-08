// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconRadio from '~icons/akar-icons/radio-fill';

import type { Info } from '@docs/components/base';
import { default as Group } from './group';
import { default as group } from './group.tsx?raw';
import { default as Radio } from './radio';
import { default as radio } from './radio.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.radio',
		icon: IconRadio,
		path: 'form/radio',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: Radio, source: radio, title: 'radio' },
			{ component: Group, source: group, title: 'group' },
		],
	};
}
