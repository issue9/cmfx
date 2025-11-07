// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { ConfirmButton } from './confirm';

describe('ConfirmButton', async () => {
    const ct = await ComponentTester.build(
        'ConfirmButton',
        props => <ConfirmButton onclick={() => { }} {...props}>button</ConfirmButton>
    );

    test('props', () => ct.testProps());
});
