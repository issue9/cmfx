// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { default as Calendar } from './calendar';

describe('Calendar', async () => {
    const ct = await ComponentTester.build('Calendar', props => <Calendar {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
