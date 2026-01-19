// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Description } from './description';

describe('Description', async () => {
    const ct = await ComponentTester.build(
        'Description',
        props => <Description {...props} />
    );

    test('props', () => ct.testProps());
});
