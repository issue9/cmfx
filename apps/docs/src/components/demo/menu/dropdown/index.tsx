// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconDropdown from '~icons/material-symbols/dropdown-outline';

import type { Info } from '@docs/components/base';
import { default as Context } from './context';
import { default as context } from './context.tsx?raw';
import { default as Custom } from './custom';
import { default as custom } from './custom.tsx?raw';
import { default as Dropdown } from './dropdown';
import { default as dropdown } from './dropdown.tsx?raw';
import { default as Empty } from './empty';
import { default as empty } from './empty.tsx?raw';
import { default as Multip } from './multip';
import { default as multip } from './multip.tsx?raw';
import { default as OnPopover } from './onpopover';
import { default as onpopover } from './onpopover.tsx?raw';

export default function (): Info {
	return {
		kind: 'navigation',
		title: '_d.demo.dropdown',
		icon: IconDropdown,
		path: 'menu/dropdown',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Dropdown, source: dropdown, id: 'dropdown' },
			{ component: Multip, source: multip, id: 'multip' },
			{ component: Context, source: context, id: 'context' },
			{ component: Empty, source: empty, id: 'empty' },
			{ component: Custom, source: custom, id: 'custom' },
			{ component: OnPopover, source: onpopover, id: 'onpopover' },
		],
	};
}
