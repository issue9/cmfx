// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Label } from './label';
import { default as label } from './label.tsx?raw';

import { default as Desc } from './description';
import { default as desc } from './description.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/typography' api={api} stages={[
        { component: Label, source: label, title: 'label' },
        { component: Desc, source: desc, title: 'description' },
    ]}>
    </Stages>;
}
