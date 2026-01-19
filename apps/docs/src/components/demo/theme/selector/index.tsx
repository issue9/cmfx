// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconTheme from '~icons/mdi/theme';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Selector } from './selector';
import { default as selector } from './selector.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        info: { title: '_d.demo.themeSelector', icon: <IconTheme /> },
        kind: 'general', path: 'theme/selector', component: () =>
            <Stages dir='theme/selector' api={api as Array<Type>} stages={[
                { component: Selector, source: selector, title: 'basic', },
            ]}>
            </Stages>,
    };
}
