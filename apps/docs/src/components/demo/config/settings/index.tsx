// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconSettings from '~icons/material-symbols/settings';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Settings } from './settings';
import { default as settings } from './settings.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.settings', icon: <IconSettings /> },
        kind: 'config', path: 'config/settings', component: () =>
            <Stages dir='config/settings' api={api as Array<Type>} stages={[
                { component: Settings, source: settings, layout: 'vertical', title: '设置页面' },
            ]}>
            </Stages>,
    };
}
