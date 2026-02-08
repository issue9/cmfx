// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconMisc from '~icons/eos-icons/miscellaneous';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'function',
		title: '_d.demo.misc',
		icon: IconMisc,
		path: 'functions/misc',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
	};
}
