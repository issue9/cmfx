// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { DateRangePanel } from './range';

describe('DateRangePanel', async () => {
    const ct = await ComponentTester.build('DateRangePanel', props => <DateRangePanel {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
