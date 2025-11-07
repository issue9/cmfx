// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { RadioGroup } from './group';
import { fieldAccessor } from '@/form/field';

describe('RadioGroup', async () => {
    const fa = fieldAccessor('chk', '1');
    const ct = await ComponentTester.build(
        'RadioGroup',
        props => <RadioGroup options={[]} accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
    test('role', () => {
        const root = ct.result.container.firstElementChild!;
        expect(root).toHaveProperty('role', 'radiogroup');
    });
});
