// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as C1 } from './options';
import { default as s1 } from './options.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/config/options' api={api as Array<Type>} stages={[
        { component: C1, source: s1, title: 'config' },
    ]}>
        经由 `run` 方法传入的一个全局性配置对象。
    </Stages>;
}
