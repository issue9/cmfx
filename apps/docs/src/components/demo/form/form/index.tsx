// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconForm from '~icons/icon-park-outline/form';

import type { Info } from '@docs/components/base';
import { default as Cols } from './col';
import { default as cols } from './col.tsx?raw';
import { default as Form } from './form';
import { default as form } from './form.tsx?raw';
import { default as Label } from './label';
import { default as label } from './label.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.form',
		icon: IconForm,
		path: 'form/form',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Form, source: form, id: 'form' },
			{ component: Label, source: label, id: 'label' },
			{ component: Cols, source: cols, id: 'cols' },
		],
	};
}
