// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import ColorPicker from './picker';
import { fieldAccessor } from '@/form/field';

describe('ColorPicker', async () => {
    const fa = fieldAccessor('chk', 'oklch(1,1,1)');
    const ct = await ComponentTester.build(
        'ColorPicker',
        props => <ColorPicker accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
