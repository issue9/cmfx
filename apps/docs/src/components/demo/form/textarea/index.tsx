// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTextarea from '~icons/bi/textarea-resize';

import type { Info } from '@docs/components/base';

import { default as Textarea } from './textarea';
import { default as textarea } from './textarea.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-input', title: '_d.demo.textarea', icon: IconTextarea, path: 'form/textarea',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Textarea, source: textarea, title: 'textarea' },
        ]
    };
}
