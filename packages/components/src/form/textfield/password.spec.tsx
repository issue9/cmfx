// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { fieldAccessor } from '@/form/field';
import { Password } from './password';

describe('Password', async () => {
    const fa = fieldAccessor('tf', 'tf');
    const ct = await ComponentTester.build(
        'Password',
        props => <Password accessor={fa} {...props} />
    );

    test('prorps', () => ct.testProps());
});
