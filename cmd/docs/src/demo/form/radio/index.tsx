// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Radio } from './radio';
import { default as radio } from './radio.tsx?raw';

import { default as Group } from './group';
import { default as group } from './group.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <Radio />, source: radio, title: 'radio' },
        { component: <Group />, source: group, title: 'group' },
    ]}>
    </Stages>;
}
