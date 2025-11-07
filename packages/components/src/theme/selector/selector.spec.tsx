// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Selector } from './selector';
import { Scheme } from '@/base';

describe('ThemeSelector', async () => {
    const ct = await ComponentTester.build(
        'ThemeSelector',
        props => <Selector schemes={new Map<string, Scheme>()} value='def' {...props} />
    );

    test('props', () => ct.testProps());
});
