// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { default as Year } from './yearpanel';

describe('YearPanel', async () => {
    const ct = await ComponentTester.build('YearPanel', props => <Year {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
