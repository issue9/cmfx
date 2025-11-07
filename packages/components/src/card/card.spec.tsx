// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Card } from './card';

describe('Card', async () => {
    const ct = await ComponentTester.build('Card', props => <Card {...props}>abc</Card>);

    // 根元素的基本属性检测
    test('props', async () => {
        ct.testProps();
    });
});
