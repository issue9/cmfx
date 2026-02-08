// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCheckbox from '~icons/mdi/checkbox-multiple-marked';

import type { Info } from '@docs/components/base';
import { default as Checkbox } from './checkbox';
import { default as checkbox } from './checkbox.tsx?raw';
import { default as Group } from './group';
import { default as group } from './group.tsx?raw';
import { default as Label } from './group-label';
import { default as label } from './group-label.tsx?raw';
import { default as Indeterminate } from './indeterminate';
import { default as indeterminate } from './indeterminate.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.checkbox',
		icon: IconCheckbox,
		path: 'form/checkbox',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: Checkbox, source: checkbox, title: 'checkbox' },
			{ component: Group, source: group, title: 'checkbox group' },
			{ component: Label, source: label, title: 'label' },
			{ component: Indeterminate, source: indeterminate, title: 'indeterminate' },
		],
	};
}
