// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { Number } from './number';
import { Ref } from './textfield';

describe('Number', async () => {
    let ref: Ref;
    const fa = fieldAccessor('tf', 5);
    const ct = await ComponentTester.build(
        'Number',
        props => <Number accessor={fa} {...props} ref={el => ref = el} />
    );

    test('prorps', () => ct.testProps());

    test('ref', async () => {
        expect(ref!.root()).not.toBeUndefined();
        expect(ref!.input()).not.toBeUndefined();
    });
});
