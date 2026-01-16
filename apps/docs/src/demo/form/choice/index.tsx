// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/choice' api={api as Array<Type>} stages={[
        { component: Basic, source: basic, title: 'basic' },
        { component: Multiple, source: multiple, title: 'multiple' },
    ]}>
    </Stages>;
}
