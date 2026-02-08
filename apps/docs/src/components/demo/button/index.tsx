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
		stages: [
			{ component: Button, source: button, title: 'button' },
			{ component: Confirm, source: confirm, title: 'confirm' },
			{ component: Anchor, source: anchor, title: 'anchor button' },
			{ component: Toggle, source: toggle, title: 'toggle button' },
			{ component: Block, source: block, title: 'block' },
			{ component: Group, source: group, title: 'group' },
			{ component: Split, source: split, title: 'SplitMenu' },
		],
	};
}
