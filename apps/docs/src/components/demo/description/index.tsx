// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconDescription from '~icons/material-symbols/description';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Desc } from './description';
import { default as desc } from './description.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'general', title: '_d.demo.description', icon: IconDescription, path: 'description',
        component: () => <Stages dir='description' api={api as Array<Type>} stages={[
            { component: Desc, source: desc, title: 'description' },
        ]}>
        </Stages>,
    };
}
