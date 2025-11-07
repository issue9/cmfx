// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { fieldAccessor } from '@/form/field';
import { Number } from './number';

describe('Number', async () => {
    const fa = fieldAccessor('tf', 5);
    const ct = await ComponentTester.build(
        'Number',
        props => <Number accessor={fa} {...props} />
    );

    test('prorps', () => ct.testProps());
});
