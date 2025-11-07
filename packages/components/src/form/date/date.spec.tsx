// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { DatePicker } from './date';
import { fieldAccessor } from '@/form/field';

describe('DatePicker', async () => {
    const fa = fieldAccessor<Date, 'number'>('chk', new Date());
    const ct = await ComponentTester.build(
        'DatePicker',
        props => <DatePicker accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
