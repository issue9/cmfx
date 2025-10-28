// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Step } from './step';
import { default as step } from './step.tsx?raw';

import { default as Mark } from './mark';
import { default as mark } from './mark.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/range' api={api} stages={[
        { component: <Basic />, source: basic, title: 'basic' },
        { component: <Step />, source: step, title: 'step' },
        { component: <Mark />, source: mark, title: 'mark' },
    ]}>
    </Stages>;
}
