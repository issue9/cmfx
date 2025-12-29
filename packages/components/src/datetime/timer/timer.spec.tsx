// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Ref, default as Timer } from './timer';

describe('Timer', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'Timer',
        props => <Timer ref={el => ref = el} duration='10s' {...props} />
    );

    test('props', () => ct.testProps());

    test('ref', () => {
        expect(ref).toBeDefined();
        expect(ref.root()).toBeInstanceOf(HTMLDivElement);
    });
});
