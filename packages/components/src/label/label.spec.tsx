// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Label } from './label';

describe('Label', async () => {
    const ct = await ComponentTester.build(
        'Label',
        props => <Label {...props} />
    );

    test('props', () => ct.testProps());
});
