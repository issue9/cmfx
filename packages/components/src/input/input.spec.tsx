// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Ref, Input } from './input';

describe('Input', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'Input',
        props => <Input {...props} onChange={() => { }} ref={el => ref = el} />
    );

    test('ref', () => {
        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.input()).not.toBeUndefined();
    });

    test('props', () => ct.testProps());
});
