// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconQRCode from '~icons/mingcute/qrcode-2-fill';

import type { Info } from '@docs/components/base';
import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';
import { default as Download } from './download';
import { default as download } from './download.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-display',
		title: '_d.demo.qrcode',
		icon: IconQRCode,
		path: 'qrcode',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: Basic, source: basic, title: '_d.demo.basicFunctions' },
			{ component: Download, source: download, title: '下载' },
		],
	};
}
