// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { fieldAccessor } from '@/form/field';
import { Album } from './album';

describe('Album', async () => {
    const fa = fieldAccessor('tf', ['url']);
    const ct = await ComponentTester.build(
        'Album',
        props => <Album fieldName='file' path='/upload' accessor={fa} {...props} />
    );

    test('prorps', () => ct.testProps());
});
