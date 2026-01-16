// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Timepanel } from './timepanel';
import { default as timepanel } from './timepanel.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/datetime/timepanel' api={api as Array<Type>} stages={[
        { component: Timepanel, source: timepanel, title: 'timepanel' },
    ]}>
    </Stages>;
}
