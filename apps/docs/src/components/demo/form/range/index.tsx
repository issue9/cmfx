// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconRange from '~icons/uil/slider-h-range';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

import { default as Basic } from './basic';
import { default as basic } from './basic.tsx?raw';

import { default as Step } from './step';
import { default as step } from './step.tsx?raw';

import { default as Mark } from './mark';
import { default as mark } from './mark.tsx?raw';

export default function(): Info {
    return {
        info: { title: '_d.demo.range', icon: <IconRange /> },
        kind: 'data-input', path: 'form/range', component: () =>
            <Stages dir='form/range' api={api as Array<Type>} stages={[
                { component: Basic, source: basic, title: 'basic' },
                { component: Step, source: step, title: 'step' },
                { component: Mark, source: mark, title: 'mark' },
            ]}>
            </Stages>,
    };
}
