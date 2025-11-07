// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { default as Month } from './monthpanel';

describe('MonthPanel', async () => {
    const ct = await ComponentTester.build('MonthPanel', props => <Month {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
