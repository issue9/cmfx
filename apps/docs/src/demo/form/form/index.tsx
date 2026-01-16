// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Form } from './form';
import { default as form } from './form.tsx?raw';

import { default as Label } from './label';
import { default as label } from './label.tsx?raw';

import { default as Cols } from './col';
import { default as cols } from './col.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form' api={api as Array<Type>} stages={[
        { component: Form, source: form, title: 'form' },
        { component: Label, source: label, title: 'label' },
        { component: Cols, source: cols, title: '多列' },
    ]}>
    </Stages>;
}
