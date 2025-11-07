// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { fieldAccessor } from '@/form/field';
import { Editor } from './editor';

describe('Editor', async () => {
    const fa = fieldAccessor('chk', 'string');
    const ct = await ComponentTester.build(
        'Editor',
        props => <Editor accessor={fa} {...props} />
    );

    test('props', () => ct.testProps());
});
