// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Tooltip } from './tooltip';
import { default as tooltip } from './tooltip.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/tooltip' api={api} stages={[
        { component: Tooltip, source: tooltip, title: 'tooltip' },
    ]}>
        这是一个弹出提示组件
    </Stages>;
}
