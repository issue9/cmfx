// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { fieldAccessor } from '@/form/field';
import { default as Range, Ref } from './range';

describe('Range', async () => {
    let ref: Ref;
    const fa = fieldAccessor<number>('tf', 0);
    const ct = await ComponentTester.build(
        'Range',
        props => <Range accessor={fa} {...props} ref={el => ref = el} />
    );

    test('ref', async () => {
        expect(ref!.root()).not.toBeUndefined();
        expect(ref!.input()).not.toBeUndefined();
    });

    test('props', () => ct.testProps());
});
