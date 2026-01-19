// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { DateRangePanel } from './range';

describe('DateRangePanel', async () => {
    const ct = await ComponentTester.build('DateRangePanel', props => <DateRangePanel {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
