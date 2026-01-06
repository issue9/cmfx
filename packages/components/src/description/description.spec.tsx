// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Description } from './description';

describe('Description', async () => {
    const ct = await ComponentTester.build(
        'Description',
        props => <Description {...props} />
    );

    test('props', () => ct.testProps());
});
