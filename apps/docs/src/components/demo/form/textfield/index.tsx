// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTextfield from '~icons/streamline-plump/input-box-solid';

import type { Info } from '@docs/components/base';
import { default as Num } from './number';
import { default as num } from './number.tsx?raw';
import { default as Password } from './password';
import { default as password } from './password.tsx?raw';
import { default as TextField } from './textfield';
import { default as textField } from './textfield.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.textfield',
		icon: IconTextfield,
		path: 'form/textfield',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: TextField, source: textField, title: 'textfield' },
			{ component: Num, source: num, title: 'number' },
			{ component: Password, source: password, title: 'password' },
		],
	};
}
