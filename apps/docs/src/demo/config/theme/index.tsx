// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Theme } from './theme';
import { default as theme } from './theme.tsx?raw';

import { default as Global } from './global';
import { default as global } from './global.tsx?raw';

import { default as Nested } from './nested';
import { default as nested } from './nested.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/config/theme' api={api} stages={[
        { component: Theme, source: theme, title: 'ThemeProvider' },
        { component: Global, source: global, title: '修改全局主题' },
        { component: Nested, source: nested, title: '嵌套' },
    ]}>
    </Stages>;
}
