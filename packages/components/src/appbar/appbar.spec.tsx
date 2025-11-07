// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { default as Appbar } from './appbar';

describe('Appbar', async () => {
    const ct = await ComponentTester.build('Appbar', props => <Appbar title="title" {...props}>abc</Appbar>);

    // 根元素的基本属性检测
    test('props', async () => {
        const root = ct.result.container.firstElementChild!;
        expect(root).toHaveProperty('role', 'toolbar');
        ct.testProps();
    });
});
