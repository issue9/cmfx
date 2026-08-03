// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconStepper from '~icons/streamline-flex/steps-2-remix';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.stepper',
		icon: IconStepper,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
