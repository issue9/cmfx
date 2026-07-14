// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { APIError } from './errors';

test('APIError', () => {
	const e = new APIError(500, 'title', new Headers({ 'Retry-After': '10' }), 'msg');

	expect(e).toBeInstanceOf(APIError);
	expect(e).toBeInstanceOf(Error);
	expect(Error.isError(e)).toBe(true);
	expect(e.status).toEqual(500);
});
