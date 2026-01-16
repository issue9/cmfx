// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Radio } from './radio';
import { default as radio } from './radio.tsx?raw';

import { default as Group } from './group';
import { default as group } from './group.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/radio' api={api as Array<Type>} stages={[
        { component: Radio, source: radio, title: 'radio' },
        { component: Group, source: group, title: 'group' },
    ]}>
    </Stages>;
}
