// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Form } from './form';
import { default as form } from './form.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form' api={api} stages={[
        { component: Form, source: form, title: 'form' },
    ]}>
    </Stages>;
}
