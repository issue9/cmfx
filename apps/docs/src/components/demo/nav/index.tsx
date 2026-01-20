// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconNav from '~icons/material-symbols/list-alt-rounded';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Nav } from './nav';
import { default as nav } from './nav.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'navigation', title: '_d.demo.nav', icon: IconNav, path: 'nav',
        component: () => <Stages dir='nav' api={api as Array<Type>} stages={[
            { component: Nav, source: nav, layout: 'vertical', title: 'nav' },
        ]} />,
    };
}
