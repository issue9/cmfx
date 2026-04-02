// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconButton from '~icons/tdesign/button-filled';

import type { Info } from '@docs/components/base';
import { default as Anchor } from './anchor';
import { default as anchor } from './anchor.tsx?raw';
import { default as Block } from './block';
import { default as block } from './block.tsx?raw';
import { default as Button } from './button';
import { default as button } from './button.tsx?raw';
import { default as Confirm } from './confirm';
import { default as confirm } from './confirm.tsx?raw';
import { default as Group } from './group';
import { default as group } from './group.tsx?raw';
import { default as Print } from './print';
import { default as print } from './print.tsx?raw';
import { default as Split } from './split';
import { default as split } from './split.tsx?raw';
import { default as Toggle } from './toggle';
import { default as toggle } from './toggle.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.button',
		icon: IconButton,
		path: 'button',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		doc: import.meta.glob('./doc.*.md', { eager: true, query: '?raw', import: 'default' }),
		stages: [
			{ component: Button, source: button, id: 'button' },
			{ component: Confirm, source: confirm, id: 'confirm' },
			{ component: Anchor, source: anchor, id: 'anchor' },
			{ component: Toggle, source: toggle, id: 'toggle' },
			{ component: Block, source: block, id: 'block' },
			{ component: Group, source: group, id: 'group' },
			{ component: Split, source: split, id: 'split' },
			{ component: Print, source: print, id: 'print' },
		],
	};
}
