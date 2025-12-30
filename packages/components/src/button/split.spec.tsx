// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Button } from './button';
import { Ref, default as SplitButton } from './split';

describe('SplitButton', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'SplitButton',
        props => <SplitButton ref={el => ref = el} {...props} items={[]}>
            <Button>btn1</Button>
        </SplitButton>
    );

    test('props', () => {
        ct.testProps();
    });

    test('ref', () => {
        expect(ref).toBeDefined();
        expect(ref.root()).toBeDefined();
        expect(ref.group()).toBeDefined();
    });
});
