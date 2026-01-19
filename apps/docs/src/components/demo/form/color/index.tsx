// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconColor from '~icons/streamline/color-picker-remix';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

import { default as Picker } from './picker';
import { default as picker } from './picker.tsx?raw';

export default function(): Info {
    return {
        info: { title: '_d.demo.color', icon: <IconColor /> },
        kind: 'data-input', path: 'form/color', component: () =>
            <Stages dir='form/color' api={api as Array<Type>} stages={[
                { component: Picker, source: picker, title: 'picker' },
            ]}>
            </Stages>,
    };
}
