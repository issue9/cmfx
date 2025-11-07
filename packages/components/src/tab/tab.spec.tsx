// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Tab } from './tab';

describe('Tab', async () => {
    const ct = await ComponentTester.build(
        'Tab',
        props => <Tab items={[{ id: 'id' }]} {...props} />
    );

    test('props', () => {
        ct.testProps();
        const root = ct.result.container.firstElementChild as HTMLElement;
        expect(root).toHaveProperty('role', 'tablist');
    });
});
