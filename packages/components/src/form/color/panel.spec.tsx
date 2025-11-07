// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import OKLCHPanel from './panel';
import { fieldAccessor } from '@/form/field';

describe('OKLCHPanel', async () => {
    const fa = fieldAccessor('chk', 'oklch(1,1,1)');
    const ct = await ComponentTester.build(
        'OKLCHPanel',
        props => <OKLCHPanel accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
