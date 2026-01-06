// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { default as Alert } from './alert';

describe('Alert', async () => {
    // type 会重定义 palette，success 对应的是 `ComponentTester.testProps` 中的 primary
    const ct = await ComponentTester.build('Alert', props => <Alert title='alert' {...props} type='success' />);

    test('props', () => ct.testProps());
});
