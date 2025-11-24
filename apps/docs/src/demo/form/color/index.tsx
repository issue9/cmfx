// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Picker } from './picker';
import { default as picker } from './picker.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/color' api={api} stages={[
        { component: Picker, source: picker, title: 'picker' },
    ]}>
    </Stages>;
}
