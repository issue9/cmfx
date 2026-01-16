// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Notify } from './notify';
import { default as notify } from './notify.tsx?raw';

import { default as Alert } from './alert';
import { default as alert } from './alert.tsx?raw';

import { default as Body } from './body';
import { default as body } from './body.tsx?raw';

import { default as Duration } from './duration';
import { default as duration } from './duration.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/notify' api={api as Array<Type>} stages={[
        { component: Notify, source: notify, title: 'notify' },
        { component: Alert, source: alert, title: 'alert' },
        { component: Body, source: body, title: 'alert with body' },
        { component: Duration, source: duration, title: 'duration' },
    ]}>
    </Stages>;
}
