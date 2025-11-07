// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { SplitButton } from './split';

describe('SplitButton', async () => {
    const ct = await ComponentTester.build(
        'SplitButton',
        props => <SplitButton menus={[]} {...props}>abc</SplitButton>
    );

    test('props', () => ct.testProps());
});
