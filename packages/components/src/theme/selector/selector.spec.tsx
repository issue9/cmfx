// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Selector } from './selector';
import { Scheme } from '@components/base';

describe('ThemeSelector', async () => {
    const ct = await ComponentTester.build(
        'ThemeSelector',
        props => <Selector schemes={new Map<string, Scheme>()} value='def' {...props} />
    );

    test('props', () => ct.testProps());
});
