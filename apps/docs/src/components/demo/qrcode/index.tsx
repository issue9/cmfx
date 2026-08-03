// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconQRCode from '~icons/mingcute/qrcode-2-fill';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.qrcode',
		icon: IconQRCode,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
