// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconThemeConfig from '~icons/mdi/theme-light-dark';

import type { Info } from '@docs/components/base';

import { default as Theme } from './theme';
import { default as theme } from './theme.tsx?raw';

import { default as Global } from './global';
import { default as global } from './global.tsx?raw';

import { default as Nested } from './nested';
import { default as nested } from './nested.tsx?raw';

export default function(): Info {
    return {
        kind: 'config', title: '_d.demo.themeConfig', icon: IconThemeConfig, path: 'config/theme',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Theme, source: theme, title: 'ThemeProvider' },
            { component: Global, source: global, title: '修改全局主题' },
            { component: Nested, source: nested, title: '嵌套' },
        ]
    };
}
