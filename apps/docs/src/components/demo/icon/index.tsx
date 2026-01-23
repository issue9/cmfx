// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconIcon from '~icons/tdesign/icon-filled';

import type { Info } from '@docs/components/base';

import { default as Text } from './text';
import { default as text } from './text.tsx?raw';

import { default as IconSet } from './iconset';
import { default as iconSet } from './iconset.tsx?raw';

export default function(): Info {
    return {
        kind: 'general', title: '_d.demo.icon', icon: IconIcon, path: 'icon',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Text, source: text, title: '与文本的排版' },
            { component: IconSet, source: iconSet, title: '图标集' },
        ]
    };
}
