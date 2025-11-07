// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Checkbox } from './checkbox';

describe('Checkbox', async () => {
    const ct = await ComponentTester.build(
        'Checkbox',
        props => <Checkbox {...props}>abc</Checkbox>
    );

    test('props', () => ct.testProps());
});
