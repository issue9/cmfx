// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import Statistic from './statistic';

describe('Statistic', async () => {
    const ct = await ComponentTester.build(
        'Statistic',
        props => <Statistic label="Label" value={5} {...props} />
    );

    test('props', () => ct.testProps());
});
