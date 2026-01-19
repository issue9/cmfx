// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconPage from '~icons/icon-park-outline/page';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

import { default as Page } from './page';
import { default as page } from './page.tsx?raw';

export default function(): Info {
    return {
        info: { title: '_d.demo.page', icon: <IconPage /> },
        kind: 'layout', path: 'page', component: () =>
            <Stages dir='page' api={api as Array<Type>} stages={[
                { component: Page, source: page, title: '基本用法' },
            ]}>
            </Stages>,
    };
}
