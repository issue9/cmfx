// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Selector } from './selector';
import { default as selector } from './selector.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/theme/selector' api={api as Array<Type>} stages={[
        { component: Selector, source: selector, title: 'basic', },
    ]}>
    </Stages>;
}
