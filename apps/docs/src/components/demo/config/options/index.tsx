// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconOptionsConfig from '~icons/eva/options-2-fill';

import type { Info } from '@docs/components/base';
import { default as Options } from './options';
import { default as options } from './options.tsx?raw';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.optionsConfig',
		icon: IconOptionsConfig,
		path: 'config/options',
		header: import.meta.glob('./HEADER.*.md', { eager: true, query: '?raw', import: 'default' }),
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [{ component: Options, source: options, id: 'options' }],
	};
}
