// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Text } from './text';
import { default as text } from './text.tsx?raw';

import { default as Animation } from './animation';
import { default as animation } from './animation.tsx?raw';

import { default as Brand } from './brand';
import { default as brand } from './brand.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/icon' api={api} stages={[
        { component: Text, source: text, title: '与文本的排版' },
        { component: Animation, source: animation, title: '动画图标' },
        { component: Brand, source: brand, title: '当前产品相关的标志' },
    ]}>
    </Stages>;
}
