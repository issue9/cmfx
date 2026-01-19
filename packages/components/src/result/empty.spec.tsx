// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import Empty from './empty';

describe('Empty', async () => {
    const ct = await ComponentTester.build(
        'Empty',
        props => <Empty {...props} />
    );

    test('props', () => ct.testProps());
});
