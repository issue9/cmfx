// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconInput from '~icons/material-symbols/input-rounded';

import type { Info } from '@docs/components/base';
import { default as Base } from './base';
import { default as base } from './base.tsx?raw';
import { default as Num } from './number';
import { default as number } from './number.tsx?raw';
import { default as Password } from './password';
import { default as password } from './password.tsx?raw';
import { default as Text } from './text';
import { default as text } from './text.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.input',
		icon: IconInput,
		path: 'input',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Base, source: base, id: 'base' },
			{ component: Num, source: number, id: 'number' },
			{ component: Text, source: text, id: 'text' },
			{ component: Password, source: password, id: 'password' },
		],
	};
}
