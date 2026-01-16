// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Input } from './input';
import { default as input } from './input.tsx?raw';

import { Stages } from '../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/input' api={api as Array<Type>} stages={[
        { component: Input, source: input, title: 'input' },
    ]}>
    </Stages>;
}
