// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { useLocale } from '@cmfx/components';
import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './basic';
import { default as s1 } from './basic.tsx?raw';

import { default as C2 } from './scrollable';
import { default as s2 } from './scrollable.tsx?raw';

import { default as C3 } from './multiple';
import { default as s3 } from './multiple.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    const l = useLocale();

    return <Stages title={l.t('_d.demo.code')} api={api} stages={[
        { component: <C1 />, source: s1, title: '基本功能' },
        { component: <C2 />, source: s2, title: '可滚动' },
        { component: <C3 />, source: s3, title: '多行不可滚动' },
    ]}>
        提供了代码高亮功能，但是未引入 `shiki` 包，如果需要使用代码高亮功能，需要引入 `shiki` 包。
    </Stages>;
}
