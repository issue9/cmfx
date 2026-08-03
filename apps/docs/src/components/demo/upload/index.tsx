// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconUpload from '~icons/flowbite/upload-solid';

import type { Info } from '@docs/components/base';

export default function (): Info {
	return {
		kind: 'data-input',
		title: '_d.demo.upload',
		icon: IconUpload,
		doc: import.meta.glob('./doc.*.mdx', { eager: true, import: 'default' }),
	};
}
