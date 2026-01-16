// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Checkbox } from './checkbox';
import { default as checkbox } from './checkbox.tsx?raw';

import { default as Group } from './group';
import { default as group } from './group.tsx?raw';

import { default as Label } from './group-label';
import { default as label } from './group-label.tsx?raw';

import { default as Indeterminate } from './indeterminate';
import { default as indeterminate } from './indeterminate.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/checkbox' api={api as Array<Type>} stages={[
        { component: Checkbox, source: checkbox, title: 'checkbox' },
        { component: Group, source: group, title: 'checkbox group' },
        { component: Label, source: label, title: 'label' },
        { component: Indeterminate, source: indeterminate, title: 'indeterminate' },
    ]}>
    </Stages>;
}
