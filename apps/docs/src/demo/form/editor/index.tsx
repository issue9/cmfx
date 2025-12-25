// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Snow } from './snow';
import { default as snow } from './snow.tsx?raw';

import { default as Bubble } from './bubble';
import { default as bubble } from './bubble.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/editor' api={api} stages={[
        { component: Snow, source: snow, title: '默认的编辑器' },
        { component: Bubble, source: bubble, title: '简单的编辑器' },
    ]}>
    </Stages>;
}
