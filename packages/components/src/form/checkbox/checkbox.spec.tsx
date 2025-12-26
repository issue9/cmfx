// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Checkbox, Ref } from './checkbox';

describe('Checkbox', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'Checkbox',
        props => <Checkbox ref={el => ref = el} {...props} />
    );

    test('props', () => ct.testProps());
    test('ref', () => {
        expect(ref).toBeDefined();
        expect(ref.element()).toBeDefined();
        expect(ref.input()).toBeDefined();
    });
});
