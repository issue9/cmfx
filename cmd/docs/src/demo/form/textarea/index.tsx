// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Textarea } from './textarea';
import { default as textarea } from './textarea.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/textarea' api={api} stages={[
        { component: <Textarea />, source: textarea, title: 'textarea' },
    ]}>
    </Stages>;
}
