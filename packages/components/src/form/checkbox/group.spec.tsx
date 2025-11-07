// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { CheckboxGroup } from './group';
import { fieldAccessor } from '@/form/field';

describe('CheckboxGroup', async () => {
    const fa = fieldAccessor('chk', ['1']);
    const ct = await ComponentTester.build(
        'CheckboxGroup',
        props => <CheckboxGroup options={[]} accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
