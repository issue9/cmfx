// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { assertType, test } from 'vitest';

import { SwapPartialRequired } from './types';

interface User {
    id: number;
    name?: string;
    email?: string;
}

interface SwapUser {
    id?: number;
    name: string;
    email: string;
}

type Result = SwapUser extends SwapPartialRequired<User> ? true : false;

test('SwapPartialRequired', () => {
    assertType<Result>(true);
});
