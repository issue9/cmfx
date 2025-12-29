// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Button, Ref } from './button';

describe('Button', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'Button',
        props => <Button {...props} ref={el => ref = el}>button</Button>
    );

    test('props', async () => {
        expect(ref!.root()).not.toBeUndefined();
        ct.testProps();
    });
});
