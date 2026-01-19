// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import Tour, { Ref, Step } from './tour';

const steps: Array<Step> = [
    { title: 'Step 1', content: 'Content for Step 1', id: 'b1', pos: 'right' },
    { title: 'Step 2222222', content: 'Content for Step 2', id: 'b2', pos: 'right' },
    { title: 'Step 3', content: 'Content for Step 3', id: 'b3', pos: 'left' },
];

describe('Tour', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'Tour',
        props => <Tour ref={el => ref = el} steps={steps} {...props} />
    );

    test('props', () => ct.testProps());
    test('ref', () => {
        expect(ref).toBeDefined();
        expect(ref.root()).toBeDefined();
    });
});
