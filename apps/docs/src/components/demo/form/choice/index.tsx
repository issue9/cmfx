// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconChoice from '~icons/tdesign/component-dropdown-filled';

import type { Info } from '@docs/components/base';

import { default as api } from './api.json' with { type: 'json' };

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Multiple } from './multiple';
import { default as multiple } from './multiple.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-input', title: '_d.demo.choice', icon: IconChoice, path: 'form/choice',
        api: api as Array<Type>, stages: [
            { component: Basic, source: basic, title: 'basic' },
            { component: Multiple, source: multiple, title: 'multiple' },
        ]
    };
}
