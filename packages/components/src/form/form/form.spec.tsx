// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Form } from './form';
import { FormAPI } from './api';

describe('Form', async () => {
    const fa = new FormAPI({
        value: {},
        submit: async (v: {}) => ({ ok: true, status: 200, body: v }),
    });
    const ct = await ComponentTester.build(
        'Form',
        props => <Form accessor={fa} {...props}>abc</Form>
    );

    test('props', () => ct.testProps());
});
