// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as C1 } from './locale';
import { default as s1 } from './locale.tsx?raw';

import { default as C2 } from './global';
import { default as s2 } from './global.tsx?raw';

import { default as C3 } from './datetime';
import { default as s3 } from './datetime.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, title: 'LocaleProvider', desc: '可通过 `LocaleProvider` 的属性修改所包含内容的语言。' },
        { component: <C2 />, source: s2, title: 'Action.switchLocale', desc: '可通过 `Action.switchLocale` 修改全局的本地化内容。' },
        { component: <C3 />, source: s3, title: '其它属性' },
    ]}>
    </Stages>;
}
