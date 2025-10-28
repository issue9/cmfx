// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as TextField } from './textfield';
import { default as textField } from './textfield.tsx?raw';

import { default as Number } from './number';
import { default as number } from './number.tsx?raw';

import { default as Password } from './password';
import { default as password } from './password.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/textfield' api={api} stages={[
        { component: <TextField />, source: textField, title: 'textfield' },
        { component: <Number />, source: number, title: 'number' },
        { component: <Password />, source: password, title: 'password' },
    ]}>
    </Stages>;
}
