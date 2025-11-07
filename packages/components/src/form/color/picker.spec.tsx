// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import OKLCHPicker from './picker';
import { fieldAccessor } from '@/form/field';

describe('OKLCHPicker', async () => {
    const fa = fieldAccessor('chk', 'oklch(1,1,1)');
    const ct = await ComponentTester.build(
        'OKLCHPicker',
        props => <OKLCHPicker accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
