// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as C1 } from './theme';
import { default as s1 } from './theme.tsx?raw';

import { default as C2 } from './global';
import { default as s2 } from './global.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    const l = useLocale();

    return <Stages api={api} title={l.t('_d.demo.themeConfig')} stages={[
        { component: <C1 />, source: s1, title: 'ThemeProvider' },
        { component: <C2 />, source: s2, title: '修改全局主题' },
    ]}>
    </Stages>;
}
