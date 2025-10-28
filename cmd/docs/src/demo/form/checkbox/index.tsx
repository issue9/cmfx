// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Checkbox } from './checkbox';
import { default as checkbox } from './checkbox.tsx?raw';

import { default as Group } from './group';
import { default as group } from './group.tsx?raw';

import { default as Indeterminate } from './indeterminate';
import { default as indeterminate } from './indeterminate.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/checkbox' api={api} stages={[
        { component: <Checkbox />, source: checkbox, title: 'checkbox' },
        { component: <Group />, source: group, title: 'checkbox group' },
        { component: <Indeterminate />, source: indeterminate, title: 'indeterminate' },
    ]}>
    </Stages>;
}
