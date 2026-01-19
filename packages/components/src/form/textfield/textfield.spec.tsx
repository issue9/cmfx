// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { Ref, TextField } from './textfield';

describe('TextField', async () => {
    let ref: Ref;
    const fa = fieldAccessor('tf', 'textfield');
    const ct = await ComponentTester.build(
        'TextField',
        props => <TextField accessor={fa} {...props} ref={el => ref = el} />
    );

    test('ref', async () => {
        expect(ref!.root()).not.toBeUndefined();
        expect(ref!.input()).not.toBeUndefined();
    });

    test('prorps', () => ct.testProps());
});
