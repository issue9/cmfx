// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Text } from './text';
import { default as text } from './text.tsx?raw';

import { default as IconSet } from './iconset';
import { default as iconSet } from './iconset.tsx?raw';

import { default as Brand } from './brand';
import { default as brand } from './brand.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/icon' api={api as Array<Type>} stages={[
        { component: Text, source: text, title: '与文本的排版' },
        { component: IconSet, source: iconSet, title: '图标集' },
        { component: Brand, source: brand, title: '当前产品相关的标志' },
    ]}>
    </Stages>;
}
