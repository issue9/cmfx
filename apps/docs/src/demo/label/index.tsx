// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Label } from './label';
import { default as label } from './label.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/typography' api={api} stages={[
        { component: Label, source: label, title: 'label' },
    ]}>
    </Stages>;
}
