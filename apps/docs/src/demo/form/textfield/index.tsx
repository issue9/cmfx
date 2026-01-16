// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as TextField } from './textfield';
import { default as textField } from './textfield.tsx?raw';

import { default as Number } from './number';
import { default as number } from './number.tsx?raw';

import { default as Password } from './password';
import { default as password } from './password.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/textfield' api={api as Array<Type>} stages={[
        { component: TextField, source: textField, title: 'textfield' },
        { component: Number, source: number, title: 'number' },
        { component: Password, source: password, title: 'password' },
    ]}>
    </Stages>;
}
