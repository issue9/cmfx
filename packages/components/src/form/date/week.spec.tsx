// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { fieldAccessor } from '@/form/field';
import { WeekValueType } from '@/datetime';
import { WeekPicker } from './week';

describe('WeekPicker', async () => {
    const fa = fieldAccessor<WeekValueType>('chk', [2025,13]);
    const ct = await ComponentTester.build(
        'WeekPicker',
        props => <WeekPicker accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
