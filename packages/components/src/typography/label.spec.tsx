// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Label } from './label';

describe('Label', async () => {
    const ct = await ComponentTester.build(
        'Label',
        props => <Label {...props} />
    );

    test('props', () => ct.testProps());
});
