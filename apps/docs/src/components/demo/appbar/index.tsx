// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconAppbar from '~icons/material-symbols/toolbar';

import type { Info } from '@docs/components/base';
import type { MarkdownFile } from '@docs/utils';

import { default as Appbar } from './appbar';
import { default as appbar } from './appbar.tsx?raw';

import { default as Anchor } from './anchor';
import { default as anchor } from './anchor.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'general', title: '_d.demo.appbar', icon: IconAppbar, path: 'appbar',
        footer: import.meta.glob<MarkdownFile>('./FOOTER.*.md', { eager: true, query: '?raw' }),
        header: import.meta.glob<MarkdownFile>('./HEADER.*.md', { eager: true, query: '?raw' }),
        api: api as Array<Type>, stages: [
            { component: Appbar, source: appbar, title: '基本功能' },
            { component: Anchor, source: anchor, title: '带链接' },
        ],
    };
}
