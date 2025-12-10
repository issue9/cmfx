// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Avatar } from './avatar';
import { default as avatar } from './avatar.tsx?raw';

import { default as Alt } from './fallback';
import { default as alt } from './fallback.tsx?raw';

import { default as Hover } from './hover';
import { default as hover } from './hover.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/appbar' api={api} stages={[
        { component: Avatar, source: avatar, title: '基本功能' },
        { component: Alt, source: alt, title: '无图片' },
        { component: Hover, source: hover, title: 'hover' },
    ]}>
    </Stages>;
}
