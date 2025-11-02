// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/functions/style' api={api}>
        提供了与样式相关的功能
    </Stages>;
}
