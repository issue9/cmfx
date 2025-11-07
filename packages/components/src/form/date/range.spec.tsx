// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { DateRangePicker } from './range';
import { fieldAccessor } from '@/form/field';

describe('DateRangePicker', async () => {
    const fa = fieldAccessor<[Date, Date], 'number'>('chk', [new Date(), new Date()]);
    const ct = await ComponentTester.build(
        'DateRangePicker',
        props => <DateRangePicker accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
