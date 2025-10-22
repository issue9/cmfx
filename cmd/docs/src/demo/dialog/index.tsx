// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as C1 } from './basic';
import { default as s1 } from './basic.tsx?raw';

import { default as C2 } from './system';
import { default as s2 } from './system.tsx?raw';

import { default as C3 } from './dialog';
import { default as s3 } from './dialog.tsx?raw';

import { default as C4 } from './scroller';
import { default as s4 } from './scroller.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <C1 />, source: s1, title: '基本功能' },
        { component: <C2 />, source: s2, title: '替换系统对话框' },
        { component: <C3 />, source: s3, title: '对话框' },
        { component: <C4 />, source: s4, title: '可滚动' },
    ]}>
    </Stages>;
}
