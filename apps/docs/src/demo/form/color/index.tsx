// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Picker } from './picker';
import { default as picker } from './picker.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/color' api={api as Array<Type>} stages={[
        { component: Picker, source: picker, title: 'picker' },
    ]}>
    </Stages>;
}
