// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconStepper from '~icons/streamline-flex/steps-2-remix';

import type { Info } from '@docs/components/base';

import { default as Stepper } from './stepper';
import { default as stepper } from './stepper.tsx?raw';

import { default as api } from './api.json' with { type: 'json' };

export default function(): Info {
    return {
        kind: 'navigation', title: '_d.demo.stepper', icon: IconStepper, path: 'wizard/stepper',
        api: api as Array<Type>, stages: [
            { component: Stepper, source: stepper, title: 'stepper' },
        ],
    };
}
