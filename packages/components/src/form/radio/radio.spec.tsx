// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Radio } from './radio';

describe('Radio', async () => {
    const ct = await ComponentTester.build(
        'Radio',
        props => <Radio {...props}>abc</Radio>
    );

    test('props', () => ct.testProps());
});
