// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconRadio from '~icons/akar-icons/radio-fill';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

import { default as Radio } from './radio';
import { default as radio } from './radio.tsx?raw';

import { default as Group } from './group';
import { default as group } from './group.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-input', title: '_d.demo.radio', icon: IconRadio, path: 'form/radio',
        component: () => <Stages dir='form/radio' api={api as Array<Type>} stages={[
            { component: Radio, source: radio, title: 'radio' },
            { component: Group, source: group, title: 'group' },
        ]}>
        </Stages>,
    };
}
