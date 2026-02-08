// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconUpload from '~icons/flowbite/upload-solid';

import type { Info } from '@docs/components/base';
import { default as Upload } from './upload';
import { default as upload } from './upload.tsx?raw';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.upload',
		icon: IconUpload,
		path: 'form/upload',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [{ component: Upload, source: upload, title: 'upload' }],
	};
}
