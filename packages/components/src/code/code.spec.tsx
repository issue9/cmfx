// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { default as Code } from './code';

describe('Code', async () => {
    const ct = await ComponentTester.build('Code', props => <Code {...props}>abc</Code>);
    test('props', () => ct.testProps());
});
