// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { DatePanel } from './date';

describe('DateRangePanel', async () => {
    const ct = await ComponentTester.build('DatePanel', props => <DatePanel {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
