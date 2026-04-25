// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { PropsError } from './errors';

test('PropsError', () => {
	const err = new PropsError('prop1', 'required');

	expect(err).toBeInstanceOf(PropsError);
	expect(err.prop).toBe('prop1');
	expect(err.message).toBe('required');
	expect(err.name).toBe('PropsError');
});
