// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Selector } from './selector';
import { default as selector } from './selector.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/theme/selector' api={api} stages={[
        { component: Selector, source: selector, title: 'basic', },
    ]}>
    </Stages>;
}
