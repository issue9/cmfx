// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { fieldAccessor } from '@/form/field';
import { TextArea } from './textarea';

describe('TextArea', async () => {
    const fa = fieldAccessor('tf', 'textarea');
    const ct = await ComponentTester.build(
        'TextArea',
        props => <TextArea accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
