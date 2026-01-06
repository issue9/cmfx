// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { default as Alert } from './alert';

describe('Alert', async () => {
    const ct = await ComponentTester.build('Dialog', props => <Alert title='alert' {...props} />);

    test('props', () => ct.testProps());
});
