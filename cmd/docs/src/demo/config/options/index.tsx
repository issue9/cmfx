// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as C1 } from './options';
import { default as s1 } from './options.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages title='options' api={api} stages={[
        { component: <C1 />, source: s1, title: 'config' },
    ]}>
        通过组件 `OptionsProvider` 可以为全局提供配置信息，这应该是整个项目的根组件，
        包含在该组件中的所有组件都可通过 `use` 获取配置信息，同时 `use` 还提供了部分实用的功能函数。
    </Stages>;
}
