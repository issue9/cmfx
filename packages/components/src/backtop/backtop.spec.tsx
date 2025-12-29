// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { BackTop, Ref } from './backtop';

describe('BackTop', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build('BackTop', props => <BackTop {...props} ref={el => ref = el}>abc</BackTop>);

    test('ref', async () => {
        expect(ref!.root()).not.toBeUndefined();
    });

    test('props', async () => {
        ct.testProps();
    });
});
