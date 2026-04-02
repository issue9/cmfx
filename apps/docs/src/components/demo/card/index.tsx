// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconCard from '~icons/mdi/card';

import type { Info } from '@docs/components/base';
import { default as Footer } from './footer';
import { default as footer } from './footer.tsx?raw';
import { default as Header } from './header';
import { default as header } from './header.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.card',
		icon: IconCard,
		path: 'card',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Header, source: header, id: 'header' },
			{ component: Footer, source: footer, id: 'footer' },
		],
	};
}
