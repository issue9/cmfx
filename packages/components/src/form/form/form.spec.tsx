// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Form } from './form';
import { FormAPI } from './access';

describe('Form', async () => {
    const req = (v: {}) => Promise.resolve({});
    const fa = new FormAPI({}, req as any);
    const ct = await ComponentTester.build(
        'Form',
        props => <Form accessor={fa} {...props}>abc</Form>
    );

    test('props', () => ct.testProps());
});
