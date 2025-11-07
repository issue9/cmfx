// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { LinkButton, Ref } from './link';

describe('LinkButton', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'LinkButton',
        props => <LinkButton {...props} href='./' ref={el => ref = el}>button</LinkButton>
    );

    test('props', async () => {
        expect(ref!.element()).not.toBeUndefined();
        ct.testProps();
    });
});
