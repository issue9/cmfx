// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { HTTPError } from './errors';

test('HTTPError', () => {
    const e = new HTTPError(500, 'title', new Headers({'Retry-After': '10'}), 'msg');

    expect(e).toBeInstanceOf(HTTPError);
    expect(e).toBeInstanceOf(Error);
    //expect(Error.isError(e)).toBeTruthy();
    expect(e.status).toEqual(500);
});
