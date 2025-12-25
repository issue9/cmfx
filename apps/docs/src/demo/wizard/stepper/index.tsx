// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Stepper } from './stepper';
import { default as stepper } from './stepper.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/wizard/stepper' api={api} stages={[
        { component: Stepper, source: stepper, title: 'stepper' },
    ]}>
    </Stages>;
}
