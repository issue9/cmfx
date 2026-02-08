// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTour from '~icons/entypo/popup';

import type { Info } from '@docs/components/base';
import { default as Tour } from './tour';
import { default as tour } from './tour.tsx?raw';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.tour',
		icon: IconTour,
		path: 'wizard/tour',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Tour, source: tour, title: 'tour' }],
	};
}
