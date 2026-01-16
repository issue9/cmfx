// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { Stages } from '../../../stages';

import { default as Settings } from './settings';
import { default as settings } from './settings.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): JSX.Element {
    return <Stages dir='demo/config/settings' api={api as Array<Type>} stages={[
        { component: Settings, source: settings, layout: 'vertical', title: '设置页面' },
    ]}>
    </Stages>;
}
