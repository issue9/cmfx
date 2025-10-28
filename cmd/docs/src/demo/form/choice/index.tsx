// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/choice' api={api} stages={[
        { component: <Basic />, source: basic, title: 'basic' },
        { component: <Multiple />, source: multiple, title: 'multiple' },
    ]}>
    </Stages>;
}
