// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Tour } from './tour';
import { default as tour } from './tour.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/wizard/tour' api={api} stages={[
        { component: Tour, source: tour, title: 'tour' },
    ]}>
    </Stages>;
}
