// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import IconFormatter from '~icons/material-symbols/text-format-rounded';

import type { Info } from '@docs/components/base';
import { default as Bits } from './bits';
import { default as bits } from './bits.tsx?raw';
import { default as Bytes } from './bytes';
import { default as bytes } from './bytes.tsx?raw';

export default function (): Info {
	return {
		kind: 'function',
		title: '_d.demo.formatter',
		icon: IconFormatter,
		path: 'formatter',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Bytes, source: bytes, id: 'bytes' },
			{ component: Bits, source: bits, id: 'bits' },
		],
	};
}
