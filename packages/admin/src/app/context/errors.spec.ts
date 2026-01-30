// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { APIError } from '@cmfx/core';
import { expect, test } from 'vitest';

test('APIError', () => {
    const e = new APIError(500, 'title', new Headers({'Retry-After': '10'}), 'msg');

    expect(e).toBeInstanceOf(APIError);
    expect(e).toBeInstanceOf(Error);
    //expect(Error.isError(e)).toBeTruthy();
    expect(e.status).toEqual(500);
});
