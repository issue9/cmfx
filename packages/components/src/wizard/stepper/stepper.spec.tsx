// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import Stepper, { Step } from './stepper';

const steps: Array<Step> = [
    { title: 'Step 1', content: 'Content for Step 1' },
    { title: 'Step 2222222', content: 'Content for Step 2' },
    { title: 'Step 3', content: 'Content for Step 3' },
] as const;

describe('Stepper', async () => {
    const ct = await ComponentTester.build(
        'Stepper',
        props => <Stepper steps={steps} {...props} />
    );

    test('props', () => ct.testProps());
});
