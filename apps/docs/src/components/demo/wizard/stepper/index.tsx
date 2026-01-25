// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconStepper from '~icons/streamline-flex/steps-2-remix';

import type { Info } from '@docs/components/base';

import { default as Stepper } from './stepper';
import { default as stepper } from './stepper.tsx?raw';

export default function(): Info {
    return {
        kind: 'navigation', title: '_d.demo.stepper', icon: IconStepper, path: 'wizard/stepper',
        api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
        stages: [
            { component: Stepper, source: stepper, title: 'stepper' },
        ],
    };
}
