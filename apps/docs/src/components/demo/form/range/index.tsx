// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconRange from '~icons/uil/slider-h-range';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';
import { default as Mark } from './mark';
import { default as mark } from './mark.tsx?raw';
import { default as Step } from './step';
import { default as step } from './step.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.range',
		icon: IconRange,
		path: 'form/range',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: Basic, source: basic, title: 'basic' },
			{ component: Step, source: step, title: 'step' },
			{ component: Mark, source: mark, title: 'mark' },
		],
	};
}
