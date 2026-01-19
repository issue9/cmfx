// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { default as Counter } from './counter';

describe('Counter', async () => {
    const ct = await ComponentTester.build('Counter', props => <Counter value={10} {...props} />);

    test('props', async () => {
        ct.testProps();
    });
});
