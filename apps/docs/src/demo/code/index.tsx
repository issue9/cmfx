// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Scrollable } from './scrollable';
import { default as scrollable } from './scrollable.tsx?raw';

import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/code' api={api} stages={[
        { component: Basic, source: basic, title: '基本功能' },
        { component: Scrollable, source: scrollable, title: '可滚动' },
        { component: Multiple, source: multiple, title: '多行不可滚动' },
    ]}>
        提供了代码高亮功能，但是未引入 `shiki` 包，如果需要使用代码高亮功能，需要引入 `shiki` 包。
    </Stages>;
}
