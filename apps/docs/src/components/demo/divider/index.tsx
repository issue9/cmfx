// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconDivider from '~icons/pixel/divider-solid';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Divider } from './divider';
import { default as divider } from './divider.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'layout', title: '_d.demo.divider', icon: IconDivider, path: 'divider',
        component: () => <Stages dir='divider' api={api as Array<Type>} stages={[
            { component: Divider, source: divider, title: 'basic' },
        ]}>
        </Stages>,
    };
}
