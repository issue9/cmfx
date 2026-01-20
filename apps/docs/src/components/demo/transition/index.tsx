// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconTransition from '~icons/material-symbols/masked-transitions';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as Transition } from './transition';
import { default as transition } from './transition.tsx?raw';

export default function(): Info {
    return {
        kind: 'general', title: '_d.demo.transition', icon: IconTransition, path: 'transition',
        component: () => <Stages dir='transition' stages={[
            { component: Transition, source: transition, title: 'transition' },
        ]}>
        </Stages>,
    };
}
