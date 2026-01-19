// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconBacktop from '~icons/tabler/transition-top-filled';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as C1 } from './preset';
import { default as s1 } from './preset.tsx?raw';

import { default as C2 } from './custom';
import { default as s2 } from './custom.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.backtop', icon: <IconBacktop /> },
        kind: 'navigation', path: 'backtop', component: () =>
            <Stages dir='backtop' api={api as Array<Type>} stages={[
                { component: C1, source: s1, title: '基本功能' },
                { component: C2, source: s2, title: '自定义图标' },
            ]}>
            </Stages>,
    };
}
