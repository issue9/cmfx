// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Locale } from './locale';
import { default as locale } from './locale.tsx?raw';

import { default as Global } from './global';
import { default as global } from './global.tsx?raw';

import { default as Other } from './other';
import { default as other } from './other.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/config/locale' api={api} stages={[
        { component: Locale, source: locale, title: 'LocaleProvider', desc: '可通过 `LocaleProvider` 的属性修改所包含内容的语言。' },
        { component: Global, source: global, title: 'setLocale', desc: '可通过 `setLocale` 修改全局的本地化内容。' },
        { component: Other, source: other, title: '其它属性' },
    ]}>
    </Stages>;
}
