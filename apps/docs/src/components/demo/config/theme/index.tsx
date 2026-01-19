// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconThemeConfig from '~icons/mdi/theme-light-dark';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Theme } from './theme';
import { default as theme } from './theme.tsx?raw';

import { default as Global } from './global';
import { default as global } from './global.tsx?raw';

import { default as Nested } from './nested';
import { default as nested } from './nested.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.themeConfig', icon: <IconThemeConfig /> },
        kind: 'config', path: 'config/theme', component: () =>
            <Stages dir='config/theme' api={api as Array<Type>} stages={[
                { component: Theme, source: theme, title: 'ThemeProvider' },
                { component: Global, source: global, title: '修改全局主题' },
                { component: Nested, source: nested, title: '嵌套' },
            ]}>
            </Stages>,
    };
}
