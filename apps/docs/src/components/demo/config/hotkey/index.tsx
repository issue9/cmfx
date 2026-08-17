// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import IconHotkeyConfig from '~icons/mingcute/hotkey-fill';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'config',
		title: '_d.demo.hotkey',
		icon: IconHotkeyConfig,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
